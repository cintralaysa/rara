import { NextRequest, NextResponse } from 'next/server';
import { verifyInternalRequest } from '@/lib/qstash';
import { startMusicGeneration } from '@/lib/musicGeneration';

// Chamado pelo QStash apos pagamento confirmado
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticacao (QStash ou internal secret)
    if (!verifyInternalRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId obrigatorio' }, { status: 400 });
    }

    console.log(`[MUSIC-GENERATE] Iniciando geracao para: ${orderId}`);

    const success = await startMusicGeneration(orderId);

    if (!success) {
      return NextResponse.json(
        { error: 'Falha ao iniciar geracao' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('[MUSIC-GENERATE] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}
