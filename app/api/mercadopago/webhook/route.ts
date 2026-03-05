import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Resend } from 'resend';
import { getOrder, updateOrder, OrderData } from '@/lib/orderStore';

const MP_ACCESS_TOKEN = (process.env.MERCADOPAGO_ACCESS_TOKEN || '').trim();
const resend = process.env.RESEND_API_KEY ? new Resend((process.env.RESEND_API_KEY || '').trim()) : null;
const FROM_EMAIL = (process.env.RESEND_FROM_EMAIL || 'Melodia Rara <onboarding@resend.dev>').trim();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'melodiarara@gmail.com').trim();

// Webhook universal do Mercado Pago (PIX + Cartao + Upsell)
export async function POST(request: NextRequest) {
  try {
    // Mercado Pago pode enviar body JSON ou query params
    let paymentId: string | null = null;

    const { searchParams } = new URL(request.url);
    const topicParam = searchParams.get('topic') || searchParams.get('type');
    const idParam = searchParams.get('id') || searchParams.get('data.id');

    if (idParam && (topicParam === 'payment' || topicParam === 'merchant_order')) {
      paymentId = idParam;
    }

    // Tentar ler body JSON
    if (!paymentId) {
      try {
        const body = await request.json();
        console.log('[WEBHOOK-MP] Body recebido:', JSON.stringify(body, null, 2));

        if (body.data?.id) {
          paymentId = String(body.data.id);
        } else if (body.id && body.type === 'payment') {
          paymentId = String(body.id);
        }
      } catch {
        // Body vazio ou nao-JSON - usar query params
      }
    }

    if (!paymentId) {
      console.log('[WEBHOOK-MP] Notificacao sem payment ID - ignorando');
      return NextResponse.json({ success: true, message: 'Notificacao recebida' });
    }

    if (!MP_ACCESS_TOKEN) {
      console.error('[WEBHOOK-MP] MERCADOPAGO_ACCESS_TOKEN nao configurado');
      return NextResponse.json({ error: 'Gateway nao configurado' }, { status: 500 });
    }

    // Buscar detalhes do pagamento na API do Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: Number(paymentId) });

    console.log('[WEBHOOK-MP] Payment status:', paymentData.status);
    console.log('[WEBHOOK-MP] External ref:', paymentData.external_reference);
    console.log('[WEBHOOK-MP] Amount:', paymentData.transaction_amount);

    // Processar apenas pagamentos aprovados
    if (paymentData.status !== 'approved') {
      console.log(`[WEBHOOK-MP] Status ${paymentData.status} - nao processado`);
      return NextResponse.json({
        success: true,
        message: `Status: ${paymentData.status}`,
        paymentId,
      });
    }

    // Extrair orderId do external_reference
    const orderId = paymentData.external_reference;
    if (!orderId) {
      console.error('[WEBHOOK-MP] Pagamento sem external_reference');
      return NextResponse.json({ error: 'external_reference ausente' }, { status: 400 });
    }

    // Detectar upsell pelo prefixo
    const isUpsell = orderId.startsWith('UPSELL-');
    if (isUpsell) {
      // TODO: Fase 6 - processar upsell
      console.log('[WEBHOOK-MP] Upsell detectado - sera implementado na Fase 6');
      return NextResponse.json({ success: true, message: 'Upsell registrado' });
    }

    // Buscar pedido no Redis
    const orderData = await getOrder(orderId);

    if (!orderData) {
      console.error(`[WEBHOOK-MP] Pedido nao encontrado: ${orderId}`);
      // Enviar email basico para admin
      await sendBasicPaymentEmail(orderId, paymentData);
      return NextResponse.json({ success: true, message: 'Processado com fallback' });
    }

    // Idempotencia: verificar se emails ja foram enviados
    if (orderData.emailSentAt) {
      console.log(`[WEBHOOK-MP] Emails ja enviados para ${orderId} em ${new Date(orderData.emailSentAt).toISOString()}`);
      return NextResponse.json({ success: true, message: 'Ja processado' });
    }

    console.log(`[WEBHOOK-MP] Processando pagamento para pedido ${orderId}`);

    // Enviar emails
    await sendCompleteOrderEmail(orderData);
    if (orderData.customerEmail) {
      await sendCustomerPaymentConfirmedEmail(orderData);
    }

    // Marcar como processado (idempotencia)
    await updateOrder(orderId, {
      emailSentAt: Date.now(),
      paymentId: String(paymentId),
      paymentMethod: paymentData.payment_method_id || 'pix',
    });

    // TODO: Fase 4 - agendar geracao de musica via QStash
    // await scheduleGeneration(orderId, 5);

    return NextResponse.json({
      success: true,
      message: 'Pagamento processado',
      orderId,
    });
  } catch (error) {
    console.error('[WEBHOOK-MP] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

// Verificacao do webhook (Mercado Pago pode enviar GET)
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook Mercado Pago Melodia Rara ativo',
    timestamp: new Date().toISOString(),
  });
}

// ====== EMAIL FUNCTIONS ======

// Email COMPLETO para admin com todos os dados do pedido
async function sendCompleteOrderEmail(orderData: OrderData) {
  const lyricsHtml = orderData.generatedLyrics ? orderData.generatedLyrics.replace(/\n/g, '<br>') : '';
  const isChaRevelacao = orderData.relationship === 'cha-revelacao' || orderData.occasion === 'cha-revelacao';
  const whatsappClean = (orderData.customerWhatsapp || '').replace(/\D/g, '');
  const whatsappLink = whatsappClean ? `https://wa.me/55${whatsappClean}` : '#';
  const valueFormatted = (orderData.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const paymentLabel = orderData.paymentMethod === 'card' ? 'Cartao' : 'PIX';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 8px 20px; border-radius: 20px; font-weight: bold; margin-top: 10px; font-size: 18px; }
        .content { background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; }
        .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981; }
        .section-gold { border-left-color: #1a1a1a; }
        .section-pink { border-left-color: #ec4899; }
        .section-title { font-weight: bold; color: #059669; margin-bottom: 15px; font-size: 16px; }
        .info-row { margin: 8px 0; }
        .lyrics-box { background: #fef3c7; padding: 20px; border-radius: 8px; font-style: italic; line-height: 1.8; border: 1px solid #fcd34d; white-space: pre-wrap; }
        .whatsapp-btn { display: inline-block; background: #25D366; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; }
        .success-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .baby-box { background: linear-gradient(135deg, #fce7f3, #dbeafe); padding: 15px; border-radius: 8px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PAGAMENTO CONFIRMADO (${paymentLabel}) - PEDIDO COMPLETO!</h1>
          <div class="badge">PAGAMENTO RECEBIDO</div>
        </div>

        <div class="content">
          <div class="success-box">
            <h2 style="color: #059669; margin: 0;">${valueFormatted}</h2>
            <p style="margin: 5px 0 0; color: #065f46;">Pagamento via ${paymentLabel} confirmado!</p>
          </div>

          <div class="section">
            <div class="section-title">ID do Pedido</div>
            <p style="font-size: 18px; font-weight: bold; font-family: monospace;">${orderData.orderId}</p>
          </div>

          <div class="section">
            <div class="section-title">Dados do Cliente</div>
            <p class="info-row"><strong>Nome:</strong> ${orderData.customerName || 'N/A'}</p>
            <p class="info-row"><strong>Email:</strong> ${orderData.customerEmail || 'N/A'}</p>
            <p class="info-row"><strong>WhatsApp:</strong> ${orderData.customerWhatsapp || 'N/A'}</p>
            ${whatsappClean ? `<p style="margin-top: 15px;"><a href="${whatsappLink}" class="whatsapp-btn">Abrir WhatsApp do Cliente</a></p>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Detalhes do Pedido</div>
            <p class="info-row"><strong>Musica para:</strong> ${orderData.honoreeName || 'N/A'}</p>
            <p class="info-row"><strong>Relacionamento:</strong> ${orderData.relationshipLabel || orderData.relationship || 'N/A'}</p>
            <p class="info-row"><strong>Ocasiao:</strong> ${orderData.occasionLabel || orderData.occasion || 'N/A'}</p>
            <p class="info-row"><strong>Ritmo${orderData.planoMelodias && orderData.planoMelodias > 1 ? ' da 1a musica' : ''}:</strong> ${orderData.musicStyleLabel || orderData.musicStyle || 'N/A'}</p>
            ${orderData.planoMelodias && orderData.planoMelodias > 1 ? `<p class="info-row"><strong>Ritmo da 2a musica:</strong> ${orderData.musicStyle2Label || orderData.musicStyle2 || 'Mesmo ritmo da 1a musica'}</p>` : ''}
            <p class="info-row"><strong>Preferencia de Voz:</strong> ${orderData.voicePreference === 'feminina' ? 'Feminina' : orderData.voicePreference === 'masculina' ? 'Masculina' : 'Sem preferencia'}</p>
          </div>

          ${isChaRevelacao ? `
          <div class="section section-pink">
            <div class="section-title" style="color: #db2777;">Informacoes do Cha Revelacao</div>
            <div class="baby-box">
              <p class="info-row"><strong>Sabe o sexo?</strong> ${orderData.knowsBabySex === 'sim' ? 'Sim' : 'Nao (surpresa!)'}</p>
              ${orderData.knowsBabySex === 'sim' && orderData.babySex ? `<p class="info-row"><strong>Sexo:</strong> ${orderData.babySex === 'menino' ? 'Menino' : 'Menina'}</p>` : ''}
              ${orderData.babyNameBoy ? `<p class="info-row"><strong>Nome se menino:</strong> ${orderData.babyNameBoy}</p>` : ''}
              ${orderData.babyNameGirl ? `<p class="info-row"><strong>Nome se menina:</strong> ${orderData.babyNameGirl}</p>` : ''}
            </div>
          </div>
          ` : ''}

          ${orderData.storyAndMessage ? `
          <div class="section">
            <div class="section-title">Historia e Detalhes</div>
            <p>${orderData.storyAndMessage.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}

          ${orderData.familyNames ? `
          <div class="section">
            <div class="section-title">Familiares para Mencionar</div>
            <p>${orderData.familyNames}</p>
          </div>
          ` : ''}

          ${lyricsHtml ? `
          <div class="section section-gold">
            <div class="section-title" style="color: #1a1a1a;">LETRA APROVADA PELO CLIENTE</div>
            <div class="lyrics-box">${lyricsHtml}</div>
          </div>
          ` : ''}

          <div class="section" style="background: #fef3c7; border-left-color: #f59e0b;">
            <div class="section-title" style="color: #d97706;">Proximo Passo</div>
            ${orderData.planoNome ? `<p><strong>Plano:</strong> ${orderData.planoNome}</p>` : ''}
            <p><strong>Prazo de entrega:</strong> ${orderData.planoEntrega || '48 horas'}</p>
            <p><strong>Musicas completas:</strong> ${orderData.planoMelodias || 1}</p>
            <p>A musica sera gerada automaticamente e entregue por email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (!resend) {
      console.log('[WEBHOOK-MP] Resend nao configurado - email nao enviado');
      return;
    }
    const planoTag = orderData.planoNome ? ` (${orderData.planoNome})` : '';
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `PAGO: ${orderData.customerName} - ${orderData.honoreeName}${planoTag} [${orderData.orderId}]`,
      html: emailHtml,
    });
    console.log('[WEBHOOK-MP] Email completo enviado para admin');
  } catch (emailError) {
    console.error('[WEBHOOK-MP] Erro ao enviar email admin:', emailError);
  }
}

// Email basico para admin (fallback quando pedido nao encontrado no Redis)
async function sendBasicPaymentEmail(orderId: string, paymentData: { transaction_amount?: number; payer?: { email?: string; first_name?: string; last_name?: string }; payment_method_id?: string }) {
  const valueFormatted = paymentData.transaction_amount
    ? `R$ ${paymentData.transaction_amount.toFixed(2).replace('.', ',')}`
    : 'N/A';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; }
        .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981; }
        .warning-box { background: #fef3c7; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PAGAMENTO CONFIRMADO (Mercado Pago)</h1>
        </div>
        <div class="content">
          <div class="warning-box">
            <strong>Atencao:</strong> Dados completos do pedido nao encontrados no Redis. Verifique manualmente.
          </div>
          <div class="section">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Valor:</strong> ${valueFormatted}</p>
            <p><strong>Metodo:</strong> ${paymentData.payment_method_id || 'N/A'}</p>
            <p><strong>Payer:</strong> ${paymentData.payer?.first_name || ''} ${paymentData.payer?.last_name || ''}</p>
            <p><strong>Email:</strong> ${paymentData.payer?.email || 'N/A'}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (!resend) return;
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `PAGO (dados parciais): ${orderId} - ${valueFormatted}`,
      html: emailHtml,
    });
    console.log('[WEBHOOK-MP] Email basico enviado para admin');
  } catch (emailError) {
    console.error('[WEBHOOK-MP] Erro ao enviar email basico:', emailError);
  }
}

// Email de confirmacao para o cliente
async function sendCustomerPaymentConfirmedEmail(orderData: OrderData) {
  const lyricsHtml = orderData.generatedLyrics ? orderData.generatedLyrics.replace(/\n/g, '<br>') : '';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #250e2c; color: white; padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .success-box { background: linear-gradient(135deg, #d1fae5, #a7f3d0); padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .highlight-box { background: #FDF5F7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #837AB6; }
        .order-details { background: #FDF5F7; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .lyrics-box { background: #FEFCFD; padding: 25px; border-radius: 10px; margin: 20px 0; font-style: italic; line-height: 1.8; white-space: pre-wrap; border: 1px solid #E2DCE8; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        h2 { color: #250e2c; margin-top: 25px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pagamento Confirmado!</h1>
        </div>

        <div class="content">
          <p>Ola <strong>${orderData.customerName}</strong>,</p>

          <div class="success-box">
            <h2 style="color: #059669; margin: 0;">Seu pagamento foi confirmado!</h2>
            <p style="margin: 10px 0 0; color: #065f46;">Ja estamos preparando sua musica personalizada.</p>
          </div>

          <p>Obrigado por confiar na <strong>Melodia Rara</strong>! Sua musica esta sendo criada com muito carinho e dedicacao.</p>

          <h2>Resumo do seu pedido</h2>
          <div class="order-details">
            <p><strong>Numero do pedido:</strong> ${orderData.orderId}</p>
            ${orderData.planoNome ? `<p><strong>Plano:</strong> ${orderData.planoNome}</p>` : ''}
            <p><strong>Musica para:</strong> ${orderData.honoreeName}</p>
            <p><strong>Ocasiao:</strong> ${orderData.occasionLabel || orderData.occasion}</p>
            <p><strong>Ritmo${orderData.planoMelodias && orderData.planoMelodias > 1 ? ' da 1a musica' : ''}:</strong> ${orderData.musicStyleLabel || orderData.musicStyle}</p>
            ${orderData.planoMelodias && orderData.planoMelodias > 1 ? `<p><strong>Ritmo da 2a musica:</strong> ${orderData.musicStyle2Label || orderData.musicStyle2 || 'Mesmo ritmo da 1a musica'}</p>` : ''}
          </div>

          ${lyricsHtml ? `
          <h2>Letra da sua musica</h2>
          <div class="lyrics-box">${lyricsHtml}</div>
          ` : ''}

          <div class="highlight-box">
            <strong>Prazo de entrega:</strong> Sua${orderData.planoMelodias && orderData.planoMelodias > 1 ? 's' : ''} musica${orderData.planoMelodias && orderData.planoMelodias > 1 ? 's' : ''} personalizada${orderData.planoMelodias && orderData.planoMelodias > 1 ? 's' : ''} ${orderData.planoMelodias && orderData.planoMelodias > 1 ? 'serao entregues' : 'sera entregue'} em ate <strong>${orderData.planoEntrega || '48 horas'}</strong>.
            ${orderData.planoMelodias && orderData.planoMelodias > 1 ? `<br><br>Voce recebera <strong>${orderData.planoMelodias} musicas completas</strong> em ritmos diferentes!` : ''}
          </div>

          <p>Qualquer duvida, estamos a disposicao!</p>
        </div>

        <div class="footer">
          <p>Melodia Rara - Transformando sentimentos em musica</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (!resend) {
      console.log('[WEBHOOK-MP] Resend nao configurado - email cliente nao enviado');
      return;
    }
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [orderData.customerEmail],
      subject: `Pagamento confirmado! Sua musica esta sendo criada - Melodia Rara`,
      html: emailHtml,
    });
    console.log(`[WEBHOOK-MP] Email confirmacao enviado para cliente: ${orderData.customerEmail}`);
  } catch (emailError) {
    console.error('[WEBHOOK-MP] Erro ao enviar email para cliente:', emailError);
  }
}
