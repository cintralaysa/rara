import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { saveOrder } from '@/lib/orderStore';
import {
  sanitizeString,
  checkRateLimit,
  getClientIP,
  validateMusicFormData,
} from '@/lib/security';

const MP_ACCESS_TOKEN = (process.env.MERCADOPAGO_ACCESS_TOKEN || '').trim();
const NOTIFICATION_URL = 'https://www.melodiarara.com/api/mercadopago/webhook';

// Precos dos planos em centavos
const PRECOS_PLANOS: Record<string, { cents: number; display: string; melodias: number; entrega: string; nome: string }> = {
  basico: { cents: 4990, display: 'R$ 49,90', melodias: 2, entrega: 'em 5 minutos', nome: 'Plano Básico' },
  premium: { cents: 7990, display: 'R$ 79,90', melodias: 4, entrega: 'em 5 minutos', nome: 'Plano Premium' },
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting por IP
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`mp-pix:${clientIP}`, 5, 60000);

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

    if (!MP_ACCESS_TOKEN) {
      console.error('MERCADOPAGO_ACCESS_TOKEN nao configurado');
      return NextResponse.json(
        { error: 'Gateway de pagamento nao configurado' },
        { status: 500 }
      );
    }

    // Gerar ID unico do pedido
    const orderId = `MR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Obter plano selecionado
    const planoId = body.planoId || 'basico';
    const plano = PRECOS_PLANOS[planoId] || PRECOS_PLANOS.basico;

    const valorFinal = plano.cents;

    // Sanitizar dados do pedido
    const orderData = {
      orderId,
      amount: valorFinal,
      planoId,
      planoNome: plano.nome,
      planoMelodias: plano.melodias,
      planoEntrega: plano.entrega,
      paymentMethod: 'pix',
      customerName: sanitizeString(body.userName, 100),
      customerEmail: sanitizeString(body.email, 100),
      customerWhatsapp: '',
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

    // Salvar pedido no Redis ANTES de criar o PIX
    const saved = await saveOrder(orderId, orderData);
    if (!saved) {
      console.error('Erro ao salvar pedido no Redis - continuando');
    }

    // Criar pagamento PIX via Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const valorEmReais = valorFinal / 100;

    const mpResult = await payment.create({
      body: {
        transaction_amount: valorEmReais,
        description: `${plano.nome} - Musica para ${orderData.honoreeName || 'presente'} (${plano.melodias} melodia${plano.melodias > 1 ? 's' : ''})`,
        payment_method_id: 'pix',
        payer: {
          email: orderData.customerEmail || 'cliente@melodiarara.com',
          first_name: orderData.customerName?.split(' ')[0] || 'Cliente',
          last_name: orderData.customerName?.split(' ').slice(1).join(' ') || '',
        },
        notification_url: NOTIFICATION_URL,
        external_reference: orderId,
      }
    });

    const transactionData = mpResult.point_of_interaction?.transaction_data;
    const paymentId = mpResult.id;

    if (!transactionData?.qr_code) {
      console.error('Mercado Pago nao retornou QR Code:', JSON.stringify(mpResult));
      return NextResponse.json({ error: 'Erro ao gerar QR Code PIX' }, { status: 500 });
    }

    // Salvar paymentId no pedido
    if (saved) {
      const { updateOrder } = await import('@/lib/orderStore');
      await updateOrder(orderId, { paymentId: String(paymentId) });
    }

    console.log('=== PIX MERCADO PAGO GERADO ===');
    console.log('Order ID:', orderId);
    console.log('Payment ID:', paymentId);
    console.log('Valor:', valorEmReais);

    const valorFormatado = `R$ ${valorEmReais.toFixed(2).replace('.', ',')}`;

    return NextResponse.json({
      success: true,
      orderId,
      paymentId: String(paymentId),
      plano: {
        id: planoId,
        nome: plano.nome,
        melodias: plano.melodias,
        entrega: plano.entrega,
      },
      pixData: {
        qrCodeBase64: `data:image/png;base64,${transactionData.qr_code_base64}`,
        pixCopiaECola: transactionData.qr_code,
        expiresAt: mpResult.date_of_expiration || new Date(Date.now() + 3600000).toISOString(),
        value: valorFinal,
        valueFormatted: valorFormatado,
      },
    });
  } catch (error) {
    console.error('Erro ao criar PIX Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
