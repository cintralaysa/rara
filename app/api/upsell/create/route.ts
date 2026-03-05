import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getOrder, saveUpsellMapping } from '@/lib/orderStore';
import { checkRateLimit, getClientIP } from '@/lib/security';

const MP_ACCESS_TOKEN = (process.env.MERCADOPAGO_ACCESS_TOKEN || '').trim();
const NOTIFICATION_URL = 'https://www.melodiarara.com/api/mercadopago/webhook';

const UPSELL_PRICE_CENTS = 1990; // R$ 19,90
const UPSELL_PRICE_REAIS = 19.90;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`upsell:${clientIP}`, 5, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Aguarde um momento' }, { status: 429 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId obrigatorio' }, { status: 400 });
    }

    // Validar pedido
    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pedido nao encontrado' }, { status: 404 });
    }

    if (order.status !== 'ready') {
      return NextResponse.json({ error: 'Musica ainda nao esta pronta' }, { status: 400 });
    }

    if (order.upsellPurchased) {
      return NextResponse.json({ error: 'Upsell ja comprado' }, { status: 400 });
    }

    if (!MP_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Gateway nao configurado' }, { status: 500 });
    }

    // Criar referencia unica para upsell
    const upsellId = `UPSELL-${orderId}-${Date.now()}`;

    // Salvar mapping no Redis
    await saveUpsellMapping(upsellId, orderId);

    // Criar PIX via Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);

    const mpResult = await payment.create({
      body: {
        transaction_amount: UPSELL_PRICE_REAIS,
        description: `+1 Melodia Extra para ${order.honoreeName || 'presente'}`,
        payment_method_id: 'pix',
        payer: {
          email: order.customerEmail || 'cliente@melodiarara.com',
          first_name: order.customerName?.split(' ')[0] || 'Cliente',
        },
        notification_url: NOTIFICATION_URL,
        external_reference: upsellId,
      },
    });

    const transactionData = mpResult.point_of_interaction?.transaction_data;

    if (!transactionData?.qr_code) {
      return NextResponse.json({ error: 'Erro ao gerar PIX' }, { status: 500 });
    }

    console.log(`[UPSELL] PIX criado: ${upsellId} -> payment ${mpResult.id}`);

    return NextResponse.json({
      success: true,
      upsellId,
      paymentId: String(mpResult.id),
      pixData: {
        qrCodeBase64: `data:image/png;base64,${transactionData.qr_code_base64}`,
        pixCopiaECola: transactionData.qr_code,
        value: UPSELL_PRICE_CENTS,
        valueFormatted: 'R$ 19,90',
      },
    });
  } catch (error) {
    console.error('[UPSELL] Erro:', error);
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 });
  }
}
