// Servico de envio de e-mail usando Resend

import { OrderData } from './orderStore';

// Tipo legado - compativel com OrderData para funcoes antigas
interface Order {
  id: string;
  amount: number;
  paymentMethod?: string;
  createdAt: number;
  customerName: string;
  customerEmail: string;
  honoreeName: string;
  relationshipLabel: string;
  occasionLabel: string;
  occasion?: string;
  musicStyleLabel: string;
  musicStyle2Label?: string;
  voicePreference: string;
  qualities?: string;
  memories?: string;
  heartMessage?: string;
  familyNames?: string;
  approvedLyrics?: string;
  knowsBabySex?: string;
  babySex?: string;
  babyNameBoy?: string;
  babyNameGirl?: string;
  planoNome?: string;
  planoMelodias?: number;
  planoEntrega?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'melodiarara@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Melodia Rara <onboarding@resend.dev>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiarara.com';

export async function sendOrderNotification(order: Order): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY nao configurada');
    return false;
  }

  const paymentMethodLabel = order.paymentMethod === 'card' ? 'Cartao de Credito' :
                             order.paymentMethod === 'pix' ? 'PIX' : 'Nao identificado';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f7f3; padding: 20px; border: 1px solid #e5e5e5; }
        .section { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #1a1a1a; }
        .section-title { font-weight: bold; color: #1a1a1a; margin-bottom: 10px; }
        .lyrics { background: #f5f3ef; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-style: italic; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .badge-card { background: #dbeafe; color: #1e40af; }
        .badge-pix { background: #d1fae5; color: #065f46; }
        .amount { font-size: 24px; font-weight: bold; color: #059669; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Novo Pedido Recebido!</h1>
          <p>Melodia Rara</p>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">Pagamento</div>
            <p class="amount">R$ ${order.amount.toFixed(2).replace('.', ',')}</p>
            <p>
              <span class="badge ${order.paymentMethod === 'card' ? 'badge-card' : 'badge-pix'}">
                ${paymentMethodLabel}
              </span>
            </p>
            <p><strong>ID do Pedido:</strong> ${order.id}</p>
            <p><strong>Data:</strong> ${new Date(order.createdAt).toLocaleString('pt-BR')}</p>
            ${order.planoNome ? `<p><strong>Plano:</strong> ${order.planoNome}</p>` : ''}
            ${order.planoMelodias ? `<p><strong>Melodias:</strong> ${order.planoMelodias}</p>` : ''}
            ${order.planoEntrega ? `<p><strong>Prazo de Entrega:</strong> ${order.planoEntrega}</p>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Cliente</div>
            <p><strong>Nome:</strong> ${order.customerName}</p>
            <p><strong>E-mail:</strong> ${order.customerEmail}</p>
          </div>

          <div class="section">
            <div class="section-title">Detalhes do Pedido</div>
            <p><strong>Para quem:</strong> ${order.honoreeName} (${order.relationshipLabel})</p>
            <p><strong>Ocasiao:</strong> ${order.occasionLabel}</p>
            <p><strong>Estilo Musical:</strong> ${order.musicStyleLabel}</p>
            <p><strong>Preferencia de Voz:</strong> ${order.voicePreference === 'feminina' ? 'Feminina' : order.voicePreference === 'masculina' ? 'Masculina' : 'Sem preferencia'}</p>
          </div>

          ${order.familyNames ? `
          <div class="section">
            <div class="section-title">Familiares para mencionar</div>
            <p>${order.familyNames}</p>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Letra Aprovada pelo Cliente</div>
            <div class="lyrics">${order.approvedLyrics}</div>
          </div>
        </div>

        <div class="footer">
          <p>Este e-mail foi enviado automaticamente pelo sistema Melodia Rara.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Novo Pedido #${order.id} - R$ ${order.amount.toFixed(2).replace('.', ',')} (${paymentMethodLabel})`,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao enviar e-mail:', error);
      return false;
    }

    console.log('E-mail enviado com sucesso para', ADMIN_EMAIL);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return false;
  }
}

// E-mail de confirmacao para o cliente (legado - usado por lib/db.ts)
export async function sendCustomerConfirmation(order: Order): Promise<boolean> {
  if (!RESEND_API_KEY || !order.customerEmail) {
    return false;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f9f7f3; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #1a1a1a; color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .content { padding: 30px; }
        .order-box { background: #f9f7f3; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .highlight-box { background: #f5f3ef; border: 2px solid #1a1a1a; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .footer { text-align: center; padding: 30px; background: #f9f7f3; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h1>Pedido Confirmado!</h1>
            <p>Sua musica personalizada esta a caminho</p>
          </div>
          <div class="content">
            <p>Ola, <strong>${order.customerName || 'Cliente'}</strong>!</p>
            <p>Recebemos seu pedido e estamos muito felizes em criar essa musica especial para voce.</p>
            <div class="order-box">
              <p><strong>Pedido:</strong> #${order.id}</p>
              <p><strong>Para quem:</strong> ${order.honoreeName}</p>
              <p><strong>Ocasiao:</strong> ${order.occasionLabel}</p>
              <p><strong>Valor:</strong> R$ ${order.amount.toFixed(2).replace('.', ',')}</p>
            </div>
            <div class="highlight-box">
              <h3>Prazo de Entrega</h3>
              <p><strong>Ate ${order.planoEntrega || '5 minutos'}</strong></p>
            </div>
          </div>
          <div class="footer">
            <p><strong>Melodia Rara</strong> - Transformando sentimentos em musica</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [order.customerEmail],
        subject: `Pedido Confirmado! Sua musica para ${order.honoreeName} esta sendo criada`,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao enviar e-mail para cliente:', error);
      return false;
    }

    console.log('E-mail de confirmacao enviado para', order.customerEmail);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail para cliente:', error);
    return false;
  }
}

// ====== NOVOS EMAILS - Entrega de musica ======

// Email de entrega de musica para o cliente
export async function sendMusicDeliveryEmail(order: OrderData): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('[EMAIL] RESEND_API_KEY nao configurada');
    return false;
  }

  if (!order.customerEmail) {
    console.error('[EMAIL] Email do cliente nao informado');
    return false;
  }

  // Idempotencia
  if (order.musicEmailSentAt) {
    console.log('[EMAIL] Email de musica ja enviado para', order.orderId);
    return true;
  }

  const playerUrl = `${APP_URL}/musica/${order.orderId}`;
  const readySongs = (order.songs || []).filter(s => s.status === 'ready');
  const totalSongs = readySongs.length;

  const songsListHtml = readySongs.map((song, i) => `
    <div style="background: white; padding: 15px; border-radius: 10px; margin: 10px 0; border-left: 4px solid #837AB6;">
      <p style="margin: 0; font-weight: bold; color: #250e2c;">
        Musica ${totalSongs > 1 ? `${i + 1}` : ''}${song.title ? ` - ${song.title}` : ''}
      </p>
      ${song.audioUrl ? `<p style="margin: 5px 0 0;"><a href="${song.audioUrl}" style="color: #837AB6; text-decoration: underline;">Download MP3</a></p>` : ''}
    </div>
  `).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #250e2c; color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .success-box { background: linear-gradient(135deg, #d1fae5, #a7f3d0); padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .player-btn { display: inline-block; background: #250e2c; color: white; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 18px; margin: 20px 0; }
        .access-code { background: #FDF5F7; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; border: 2px dashed #837AB6; }
        .access-code .code { font-size: 24px; font-weight: bold; font-family: monospace; color: #250e2c; letter-spacing: 3px; }
        .songs-list { margin: 20px 0; }
        .footer { text-align: center; padding: 30px; background: #f9f7f3; }
        .footer p { margin: 5px 0; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h1>Sua Musica Esta Pronta!</h1>
            <p>Melodia Rara</p>
          </div>

          <div class="content">
            <p>Ola, <strong>${order.customerName}</strong>!</p>

            <div class="success-box">
              <h2 style="color: #059669; margin: 0;">Sua${totalSongs > 1 ? 's' : ''} musica${totalSongs > 1 ? 's' : ''} para ${order.honoreeName} ${totalSongs > 1 ? 'estao prontas' : 'esta pronta'}!</h2>
            </div>

            <p style="text-align: center;">Clique no botao abaixo para ouvir${totalSongs > 1 ? ' todas as versoes' : ''} e fazer download:</p>

            <div style="text-align: center;">
              <a href="${playerUrl}" class="player-btn">Ouvir Minha Musica</a>
            </div>

            ${order.accessCode ? `
            <div class="access-code">
              <p style="margin: 0 0 5px; color: #6b7280; font-size: 14px;">Seu codigo de acesso:</p>
              <p class="code">${order.accessCode}</p>
              <p style="margin: 5px 0 0; color: #6b7280; font-size: 12px;">Use este codigo para acessar sua musica a qualquer momento</p>
            </div>
            ` : ''}

            <div class="songs-list">
              ${songsListHtml}
            </div>

            <div style="background: #FDF5F7; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Detalhes do pedido:</strong></p>
              <p style="margin: 5px 0;"><strong>Pedido:</strong> ${order.orderId}</p>
              <p style="margin: 5px 0;"><strong>Homenageado:</strong> ${order.honoreeName}</p>
              <p style="margin: 5px 0;"><strong>Ocasiao:</strong> ${order.occasionLabel || order.occasion}</p>
              <p style="margin: 5px 0;"><strong>Estilo:</strong> ${order.musicStyleLabel || order.musicStyle}</p>
            </div>

            <p style="text-align: center; color: #6b7280;">
              Esperamos que voce ame sua musica! Compartilhe esse momento especial.
            </p>
          </div>

          <div class="footer">
            <p><strong>Melodia Rara</strong></p>
            <p>Transformando sentimentos em musica</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [order.customerEmail],
        subject: `Sua musica para ${order.honoreeName} esta pronta! - Melodia Rara`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[EMAIL] Erro ao enviar email de entrega:', error);
      return false;
    }

    console.log(`[EMAIL] Email de entrega enviado para ${order.customerEmail}`);

    // Notificar admin tambem
    await sendMusicReadyAdminEmail(order, playerUrl);

    return true;
  } catch (error) {
    console.error('[EMAIL] Erro ao enviar email de entrega:', error);
    return false;
  }
}

// Email para admin quando musica fica pronta
async function sendMusicReadyAdminEmail(order: OrderData, playerUrl: string): Promise<void> {
  if (!RESEND_API_KEY) return;

  const readySongs = (order.songs || []).filter(s => s.status === 'ready');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; }
        .section { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #059669; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MUSICA PRONTA - Entrega Automatica!</h1>
        </div>
        <div class="content">
          <div class="section">
            <p><strong>Pedido:</strong> ${order.orderId}</p>
            <p><strong>Cliente:</strong> ${order.customerName} (${order.customerEmail})</p>
            <p><strong>Homenageado:</strong> ${order.honoreeName}</p>
            <p><strong>Musicas prontas:</strong> ${readySongs.length}</p>
            <p><strong>Player:</strong> <a href="${playerUrl}">${playerUrl}</a></p>
            ${order.accessCode ? `<p><strong>Codigo:</strong> ${order.accessCode}</p>` : ''}
          </div>
          ${readySongs.map((s, i) => `
          <div class="section">
            <p><strong>Musica ${i + 1}:</strong> ${s.title || 'Sem titulo'}</p>
            ${s.audioUrl ? `<p><a href="${s.audioUrl}">Download MP3</a></p>` : ''}
          </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `MUSICA PRONTA: ${order.customerName} - ${order.honoreeName} [${order.orderId}]`,
        html: emailHtml,
      }),
    });
    console.log('[EMAIL] Email admin de musica pronta enviado');
  } catch (error) {
    console.error('[EMAIL] Erro ao enviar email admin:', error);
  }
}
