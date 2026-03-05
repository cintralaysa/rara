import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { saveOrder, updateOrder } from '@/lib/orderStore';
import {
  sanitizeString,
  checkRateLimit,
  getClientIP,
  validateMusicFormData,
} from '@/lib/security';

const MP_ACCESS_TOKEN = (process.env.MERCADOPAGO_ACCESS_TOKEN || '').trim();
const NOTIFICATION_URL = 'https://www.melodiarara.com/api/mercadopago/webhook';

const PRECOS_PLANOS: Record<string, { cents: number; melodias: number; entrega: string; nome: string }> = {
  basico: { cents: 4990, melodias: 1, entrega: 'em 5 minutos', nome: 'Plano Basico' },
  premium: { cents: 7990, melodias: 2, entrega: 'em 5 minutos', nome: 'Plano Premium' },
};

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`mp-card:${clientIP}`, 5, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Muitas requisicoes. Aguarde um momento.' }, { status: 429 });
    }

    const body = await request.json();
    const { cardData, orderData: rawOrderData } = body;

    if (!cardData?.token) {
      return NextResponse.json({ error: 'Token do cartao obrigatorio' }, { status: 400 });
    }

    if (!MP_ACCESS_TOKEN) {
      console.error('MERCADOPAGO_ACCESS_TOKEN nao configurado');
      return NextResponse.json({ error: 'Gateway de pagamento nao configurado' }, { status: 500 });
    }

    // Validar dados do formulario
    const validation = validateMusicFormData(rawOrderData);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const orderId = `MR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const planoId = rawOrderData.planoId || 'basico';
    const plano = PRECOS_PLANOS[planoId] || PRECOS_PLANOS.basico;

    const valorFinal = plano.cents;
    const valorEmReais = valorFinal / 100;

    // Salvar pedido no Redis ANTES de processar pagamento
    const orderToSave = {
      orderId,
      amount: valorFinal,
      planoId,
      planoNome: plano.nome,
      planoMelodias: plano.melodias,
      planoEntrega: plano.entrega,
      paymentMethod: 'card',
      customerName: sanitizeString(rawOrderData.userName, 100),
      customerEmail: sanitizeString(rawOrderData.email, 100),
      customerWhatsapp: '',
      honoreeName: sanitizeString(rawOrderData.honoreeName, 100),
      relationship: sanitizeString(rawOrderData.relationship, 50),
      relationshipLabel: sanitizeString(rawOrderData.relationshipLabel, 100),
      occasion: sanitizeString(rawOrderData.occasion, 50),
      occasionLabel: sanitizeString(rawOrderData.occasionLabel, 100),
      musicStyle: sanitizeString(rawOrderData.musicStyle, 50),
      musicStyleLabel: sanitizeString(rawOrderData.musicStyleLabel, 100),
      musicStyle2: sanitizeString(rawOrderData.musicStyle2 || '', 50),
      musicStyle2Label: sanitizeString(rawOrderData.musicStyle2Label || '', 100),
      voicePreference: sanitizeString(rawOrderData.voicePreference, 30),
      storyAndMessage: sanitizeString(rawOrderData.storyAndMessage || rawOrderData.memories || '', 1500),
      familyNames: sanitizeString(rawOrderData.familyNames, 300),
      generatedLyrics: sanitizeString(rawOrderData.generatedLyrics, 3000),
      knowsBabySex: sanitizeString(rawOrderData.knowsBabySex, 10),
      babySex: sanitizeString(rawOrderData.babySex, 20),
      babyNameBoy: sanitizeString(rawOrderData.babyNameBoy, 100),
      babyNameGirl: sanitizeString(rawOrderData.babyNameGirl, 100),
    };

    await saveOrder(orderId, orderToSave);

    // Processar pagamento com cartao via Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);

    const mpResult = await payment.create({
      body: {
        transaction_amount: valorEmReais,
        token: cardData.token,
        description: `${plano.nome} - Musica para ${orderToSave.honoreeName || 'presente'}`,
        installments: cardData.installments || 1,
        payment_method_id: cardData.payment_method_id,
        issuer_id: cardData.issuer_id,
        payer: {
          email: orderToSave.customerEmail || cardData.payer?.email || 'cliente@melodiarara.com',
          identification: cardData.payer?.identification,
        },
        notification_url: NOTIFICATION_URL,
        external_reference: orderId,
      }
    });

    const paymentId = mpResult.id;
    const mpStatus = mpResult.status;

    // Atualizar pedido com paymentId
    await updateOrder(orderId, { paymentId: String(paymentId) });

    console.log('=== CARTAO MERCADO PAGO ===');
    console.log('Order ID:', orderId);
    console.log('Payment ID:', paymentId);
    console.log('Status:', mpStatus, mpResult.status_detail);

    if (mpStatus === 'approved') {
      return NextResponse.json({
        success: true,
        status: 'approved',
        orderId,
        paymentId: String(paymentId),
      });
    }

    if (mpStatus === 'in_process' || mpStatus === 'pending') {
      return NextResponse.json({
        success: true,
        status: 'pending',
        orderId,
        paymentId: String(paymentId),
        message: 'Pagamento em processamento',
      });
    }

    // Rejeitado
    return NextResponse.json({
      success: false,
      status: mpStatus,
      statusDetail: mpResult.status_detail,
      error: getCardErrorMessage(mpResult.status_detail || ''),
    }, { status: 400 });

  } catch (error) {
    console.error('Erro ao processar cartao:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento com cartao' },
      { status: 500 }
    );
  }
}

function getCardErrorMessage(statusDetail: string): string {
  const messages: Record<string, string> = {
    cc_rejected_bad_filled_card_number: 'Numero do cartao incorreto',
    cc_rejected_bad_filled_date: 'Data de validade incorreta',
    cc_rejected_bad_filled_other: 'Dados do cartao incorretos',
    cc_rejected_bad_filled_security_code: 'Codigo de seguranca incorreto',
    cc_rejected_blacklist: 'Cartao bloqueado pelo banco',
    cc_rejected_call_for_authorize: 'Ligue para o banco para autorizar a compra',
    cc_rejected_card_disabled: 'Cartao desativado. Ative-o no app do banco',
    cc_rejected_duplicated_payment: 'Pagamento duplicado. Tente novamente em alguns minutos',
    cc_rejected_high_risk: 'Pagamento recusado por seguranca. Tente PIX',
    cc_rejected_insufficient_amount: 'Saldo insuficiente',
    cc_rejected_invalid_installments: 'Numero de parcelas invalido',
    cc_rejected_max_attempts: 'Limite de tentativas. Tente outro cartao ou PIX',
    cc_rejected_other_reason: 'Cartao recusado. Tente outro cartao ou PIX',
  };
  return messages[statusDetail] || 'Pagamento recusado. Tente outro cartao ou PIX.';
}
