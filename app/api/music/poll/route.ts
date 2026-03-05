import { NextRequest, NextResponse } from 'next/server';
import { verifyInternalRequest, schedulePoll } from '@/lib/qstash';
import { checkTaskStatus, isTerminalStatus, isFailedStatus } from '@/lib/sunoClient';
import { handleSongComplete, handleSongFailed } from '@/lib/musicGeneration';
import { getOrderByTaskId } from '@/lib/orderStore';

const MAX_ATTEMPTS = 40; // ~10 minutos com delays progressivos

// Chamado pelo QStash para verificar status de geracao
export async function POST(request: NextRequest) {
  try {
    if (!verifyInternalRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, taskId, attempt = 0 } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'taskId obrigatorio' }, { status: 400 });
    }

    console.log(`[MUSIC-POLL] Verificando task ${taskId} (tentativa ${attempt})`);

    // Verificar status no Suno
    const result = await checkTaskStatus(taskId);

    console.log(`[MUSIC-POLL] Status: ${result.status} para task ${taskId}`);

    if (result.status === 'SUCCESS' && result.songs.length > 0) {
      // Musica pronta! Buscar orderId se nao veio no body
      const resolvedOrderId = orderId || (await getOrderByTaskId(taskId))?.orderId;

      if (resolvedOrderId) {
        await handleSongComplete(
          resolvedOrderId,
          taskId,
          result.songs.map(s => ({
            id: s.id,
            audioUrl: s.audioUrl,
            imageUrl: s.imageUrl,
            title: s.title,
            duration: s.duration,
          }))
        );
      }

      return NextResponse.json({ status: 'completed', songs: result.songs.length });
    }

    if (isFailedStatus(result.status)) {
      const resolvedOrderId = orderId || (await getOrderByTaskId(taskId))?.orderId;

      if (resolvedOrderId) {
        await handleSongFailed(
          resolvedOrderId,
          taskId,
          result.errorMessage || result.status
        );
      }

      return NextResponse.json({ status: 'failed', error: result.errorMessage });
    }

    // Ainda processando - agendar proximo poll
    if (!isTerminalStatus(result.status) && attempt < MAX_ATTEMPTS) {
      await schedulePoll(orderId, taskId, attempt + 1);
      return NextResponse.json({ status: 'polling', attempt: attempt + 1 });
    }

    // Timeout - muitas tentativas
    if (attempt >= MAX_ATTEMPTS) {
      const resolvedOrderId = orderId || (await getOrderByTaskId(taskId))?.orderId;
      if (resolvedOrderId) {
        await handleSongFailed(resolvedOrderId, taskId, 'Timeout: geracao demorou demais');
      }
      return NextResponse.json({ status: 'timeout' });
    }

    return NextResponse.json({ status: result.status });
  } catch (error) {
    console.error('[MUSIC-POLL] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
