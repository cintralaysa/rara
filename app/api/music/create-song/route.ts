import { NextRequest, NextResponse } from 'next/server';
import { getOrder, updateOrder } from '@/lib/orderStore';
import { startMusicGeneration } from '@/lib/musicGeneration';
import { verifyInternalRequest } from '@/lib/qstash';

// Criar musica adicional usando creditos disponíveis
// Chamado pelo webhook apos upsell ser pago, ou pelo QStash
export async function POST(request: NextRequest) {
  try {
    if (!verifyInternalRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId obrigatorio' }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pedido nao encontrado' }, { status: 404 });
    }

    const creditsAvailable = (order.creditsTotal || 0) - (order.creditsUsed || 0);
    if (creditsAvailable <= 0) {
      return NextResponse.json({ error: 'Sem creditos disponiveis' }, { status: 400 });
    }

    // Atualizar status para generating
    await updateOrder(orderId, {
      status: 'generating',
      musicStatus: 'generating',
    });

    // Iniciar geracao (reusa a mesma funcao, mas agora com creditsTotal atualizado)
    const success = await startMusicGeneration(orderId);

    if (!success) {
      return NextResponse.json({ error: 'Falha ao iniciar geracao' }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('[CREATE-SONG] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
