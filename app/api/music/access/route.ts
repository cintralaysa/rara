import { NextRequest, NextResponse } from 'next/server';
import { getOrderByAccessCode } from '@/lib/orderStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Codigo de acesso invalido' },
        { status: 400 }
      );
    }

    // Normalizar: uppercase, remover espacos
    let normalizedCode = code.trim().toUpperCase();

    // Se o usuario digitou so os 4 caracteres, adicionar prefixo
    if (/^[A-Z0-9]{4}$/.test(normalizedCode)) {
      normalizedCode = `RARA-${normalizedCode}`;
    }

    // Validar formato
    if (!/^RARA-[A-Z0-9]{4}$/.test(normalizedCode)) {
      return NextResponse.json(
        { error: 'Formato invalido. Use o codigo recebido por email (ex: RARA-AB12)' },
        { status: 400 }
      );
    }

    const order = await getOrderByAccessCode(normalizedCode);

    if (!order) {
      return NextResponse.json(
        { error: 'Codigo nao encontrado. Verifique se digitou corretamente.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
      musicStatus: order.musicStatus || 'pending',
    });
  } catch (error) {
    console.error('[ACCESS] Erro ao buscar por codigo:', error);
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}
