import { NextRequest, NextResponse } from 'next/server';
import { saveOrder } from '@/lib/orderStore';
import {
  sanitizeString,
  checkRateLimit,
  getClientIP,
  validateMusicFormData,
  isValidBrazilianPhone
} from '@/lib/security';

const OPENPIX_APP_ID = process.env.OPENPIX_APP_ID;

// Precos dos planos em centavos
const PRECOS_PLANOS: { [key: string]: { cents: number; display: string; melodias: number; entrega: string; nome: string } } = {
  basico: { cents: 5990, display: 'R$ 59,90', melodias: 1, entrega: 'em até 48 horas', nome: 'Plano Básico' },
  premium: { cents: 7990, display: 'R$ 79,90', melodias: 2, entrega: 'no mesmo dia', nome: 'Plano Premium' },
};

// Cupom de desconto valido
const CUPOM_VALIDO = 'RARA10';
const CUPOM_DESCONTO = 0.10; // 10%

export async function POST(request: NextRequest) {
  try {
    // Rate limiting por IP
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`pix:${clientIP}`, 5, 60000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Muitas requisicoes. Aguarde um momento.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validar dados do formulario
    const validation = validateMusicFormData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Validacao adicional de WhatsApp
    if (!isValidBrazilianPhone(body.whatsapp || '')) {
      return NextResponse.json({ error: 'WhatsApp invalido' }, { status: 400 });
    }

    // Gerar ID unico do pedido
    const orderId = `MR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const correlationID = orderId;

    if (!OPENPIX_APP_ID) {
      console.error('OPENPIX_APP_ID nao configurado');
      return NextResponse.json(
        { error: 'Gateway de pagamento nao configurado' },
        { status: 500 }
      );
    }

    // Obter plano selecionado (default: basico)
    const planoId = body.planoId || 'basico';
    const plano = PRECOS_PLANOS[planoId] || PRECOS_PLANOS.basico;

    // Verificar cupom de desconto
    const cupom = sanitizeString(body.cupom || '', 20).toUpperCase();
    const cupomValido = cupom === CUPOM_VALIDO;
    const valorFinal = cupomValido ? Math.round(plano.cents * (1 - CUPOM_DESCONTO)) : plano.cents;

    // Sanitizar e preparar dados do pedido
    const orderData = {
      orderId,
      amount: valorFinal,
      planoId,
      planoNome: plano.nome,
      planoMelodias: plano.melodias,
      planoEntrega: plano.entrega,
      customerName: sanitizeString(body.userName, 100),
      customerEmail: sanitizeString(body.email, 100),
      customerWhatsapp: sanitizeString(body.whatsapp, 50),
      honoreeName: sanitizeString(body.honoreeName, 100),
      relationship: sanitizeString(body.relationship, 50),
      relationshipLabel: sanitizeString(body.relationshipLabel, 100),
      occasion: sanitizeString(body.occasion, 50),
      occasionLabel: sanitizeString(body.occasionLabel, 100),
      musicStyle: sanitizeString(body.musicStyle, 50),
      musicStyleLabel: sanitizeString(body.musicStyleLabel, 100),
      musicStyle2: sanitizeString(body.musicStyle2 || '', 50),
      musicStyle2Label: sanitizeString(body.musicStyle2Label || '', 100),
      voicePreference: sanitizeString(body.voicePreference, 30),
      storyAndMessage: sanitizeString(body.storyAndMessage || body.memories || '', 1500),
      familyNames: sanitizeString(body.familyNames, 300),
      generatedLyrics: sanitizeString(body.generatedLyrics, 3000),
      knowsBabySex: sanitizeString(body.knowsBabySex, 10),
      babySex: sanitizeString(body.babySex, 20),
      babyNameBoy: sanitizeString(body.babyNameBoy, 100),
      babyNameGirl: sanitizeString(body.babyNameGirl, 100),
    };

    // Salvar dados completos do pedido no Redis ANTES de criar o PIX
    const saved = await saveOrder(correlationID, orderData);

    if (!saved) {
      console.error('Erro ao salvar pedido no Redis - continuando mesmo assim');
    }

    // Criar cobranca PIX na Woovi/OpenPix
    const pixResponse = await fetch('https://api.openpix.com.br/api/v1/charge', {
      method: 'POST',
      headers: {
        'Authorization': OPENPIX_APP_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correlationID,
        value: valorFinal,
        comment: `${orderData.planoNome}${cupomValido ? ' (cupom 10%)' : ''} - Musica para ${orderData.honoreeName || 'presente'} (${plano.melodias} melodia${plano.melodias > 1 ? 's' : ''})`,
        customer: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          phone: orderData.customerWhatsapp?.replace(/\D/g, ''),
        },
        additionalInfo: [
          { key: 'Plano', value: orderData.planoNome },
          { key: 'Melodias', value: String(plano.melodias) },
          { key: 'Entrega', value: plano.entrega },
          { key: 'Homenageado', value: orderData.honoreeName || '' },
          { key: 'Ocasiao', value: orderData.occasionLabel || orderData.occasion || '' },
        ],
        expiresIn: 3600, // 1 hora para pagar
      }),
    });

    if (!pixResponse.ok) {
      const errorData = await pixResponse.text();
      console.error('Erro OpenPix:', errorData);
      return NextResponse.json(
        { error: 'Erro ao gerar PIX' },
        { status: 500 }
      );
    }

    const pixData = await pixResponse.json();

    console.log('=== PIX GERADO ===');
    console.log('Order ID:', orderId);
    console.log('Correlation ID:', correlationID);
    console.log('Dados salvos no Redis:', saved ? 'SIM' : 'NAO');
    console.log('QR Code gerado com sucesso');
    console.log('Aguardando pagamento - emails serao enviados apos confirmacao');

    // NAO enviar emails aqui - so apos confirmacao do pagamento via webhook

    const valorFormatado = cupomValido
      ? `R$ ${(valorFinal / 100).toFixed(2).replace('.', ',')}`
      : plano.display;

    return NextResponse.json({
      success: true,
      orderId,
      correlationID,
      cupomAplicado: cupomValido,
      plano: {
        id: planoId,
        nome: orderData.planoNome,
        melodias: plano.melodias,
        entrega: plano.entrega,
      },
      pixData: {
        qrCode: pixData.charge?.qrCodeImage || pixData.qrCodeImage,
        qrCodeBase64: pixData.charge?.qrCodeImage || pixData.qrCodeImage,
        pixCopiaECola: pixData.charge?.brCode || pixData.brCode,
        expiresAt: pixData.charge?.expiresAt || pixData.expiresAt,
        value: valorFinal,
        valueFormatted: valorFormatado,
      },
    });
  } catch (error) {
    console.error('Erro ao criar PIX:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
