import { NextRequest, NextResponse } from 'next/server';
import { handleSongComplete, handleSongFailed } from '@/lib/musicGeneration';
import { getOrderByTaskId } from '@/lib/orderStore';

// Callback do Suno API quando geracao completa
// Alternativa ao polling - chamado automaticamente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[SUNO-CALLBACK] Recebido:', JSON.stringify(body).substring(0, 500));

    const taskId = body.data?.task_id;
    const callbackType = body.data?.callbackType;
    const songs = body.data?.data;

    if (!taskId) {
      return NextResponse.json({ error: 'task_id obrigatorio' }, { status: 400 });
    }

    // Buscar orderId pelo taskId
    const order = await getOrderByTaskId(taskId);
    if (!order) {
      console.error(`[SUNO-CALLBACK] Pedido nao encontrado para task: ${taskId}`);
      return NextResponse.json({ received: true });
    }

    // Somente processar quando completo
    if (callbackType === 'complete' && Array.isArray(songs) && songs.length > 0) {
      await handleSongComplete(
        order.orderId,
        taskId,
        songs.map((s: any) => ({
          id: s.id,
          audioUrl: (s.audio_url || s.audioUrl || '').replace('audiopipe.suno.ai', 'cdn1.suno.ai'),
          imageUrl: s.image_url || s.imageUrl || '',
          title: s.title || '',
          duration: s.duration || 0,
        }))
      );

      console.log(`[SUNO-CALLBACK] Musicas completas para pedido ${order.orderId}`);
    } else if (body.code !== 200) {
      // Falha
      await handleSongFailed(order.orderId, taskId, body.msg || 'Callback com erro');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[SUNO-CALLBACK] Erro:', error);
    return NextResponse.json({ received: true });
  }
}
