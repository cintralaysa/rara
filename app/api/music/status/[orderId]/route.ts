import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/orderStore';

// Status do pedido (para frontend polling)
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId obrigatorio' }, { status: 400 });
    }

    const order = await getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Pedido nao encontrado' }, { status: 404 });
    }

    // Filtrar dados sensiveis - retornar somente o necessario
    const readySongs = (order.songs || [])
      .filter(s => s.status === 'ready')
      .map(s => ({
        audioUrl: s.audioUrl,
        title: s.title,
        completedAt: s.completedAt,
      }));

    const totalSongs = order.planoMelodias || 1;
    const readyCount = readySongs.length;

    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
      musicStatus: order.musicStatus || 'pending',
      accessCode: order.accessCode,
      honoreeName: order.honoreeName,
      occasion: order.occasionLabel,
      musicStyle: order.musicStyleLabel,
      planoNome: order.planoNome,
      totalSongs,
      readyCount,
      progress: totalSongs > 0 ? Math.round((readyCount / totalSongs) * 100) : 0,
      songs: readySongs,
      musicUrls: order.musicUrls || [],
    });
  } catch (error) {
    console.error('[MUSIC-STATUS] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
