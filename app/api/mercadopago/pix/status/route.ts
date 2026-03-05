import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const MP_ACCESS_TOKEN = (process.env.MERCADOPAGO_ACCESS_TOKEN || '').trim();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId obrigatorio' },
        { status: 400 }
      );
    }

    if (!MP_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Gateway nao configurado' },
        { status: 500 }
      );
    }

    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const result = await payment.get({ id: Number(paymentId) });

    const statusMap: Record<string, string> = {
      approved: 'paid',
      authorized: 'paid',
      pending: 'pending',
      in_process: 'pending',
      rejected: 'failed',
      cancelled: 'expired',
      refunded: 'refunded',
      charged_back: 'refunded',
    };

    const mappedStatus = statusMap[result.status || ''] || 'pending';

    return NextResponse.json({
      status: mappedStatus,
      isPaid: mappedStatus === 'paid',
      isExpired: mappedStatus === 'expired' || mappedStatus === 'failed',
      mpStatus: result.status,
      mpStatusDetail: result.status_detail,
      orderId: result.external_reference,
    });
  } catch (error) {
    console.error('Erro ao verificar status PIX:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar status' },
      { status: 500 }
    );
  }
}
