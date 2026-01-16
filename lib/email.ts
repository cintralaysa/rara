// Servico de envio de e-mail usando Resend

import { Order } from './db';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'melodiarara@gmail.com';

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
          <h1>🎵 Novo Pedido Recebido!</h1>
          <p>Melodia Rara</p>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">💰 Pagamento</div>
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
            <div class="section-title">👤 Cliente</div>
            <p><strong>Nome:</strong> ${order.customerName}</p>
            <p><strong>E-mail:</strong> ${order.customerEmail}</p>
            <p><strong>WhatsApp:</strong> ${order.customerWhatsapp}</p>
          </div>

          <div class="section">
            <div class="section-title">🎁 Detalhes do Pedido</div>
            <p><strong>Para quem:</strong> ${order.honoreeName} (${order.relationshipLabel})</p>
            <p><strong>Ocasiao:</strong> ${order.occasionLabel}</p>
            <p><strong>Estilo Musical ${order.planoMelodias && order.planoMelodias > 1 ? '1ª melodia' : ''}:</strong> ${order.musicStyleLabel}</p>
            ${order.planoMelodias && order.planoMelodias > 1 ? `<p><strong>Estilo Musical 2ª melodia:</strong> ${order.musicStyle2Label || order.musicStyleLabel}</p>` : ''}
            <p><strong>Preferencia de Voz:</strong> ${order.voicePreference === 'feminina' ? 'Feminina' : order.voicePreference === 'masculina' ? 'Masculina' : 'Sem preferencia'}</p>
          </div>

          ${order.qualities ? `
          <div class="section">
            <div class="section-title">💝 Qualidades</div>
            <p>${order.qualities}</p>
          </div>
          ` : ''}

          ${order.memories ? `
          <div class="section">
            <div class="section-title">🎵 Memorias</div>
            <p>${order.memories}</p>
          </div>
          ` : ''}

          ${order.heartMessage ? `
          <div class="section">
            <div class="section-title">💌 Mensagem do Coracao</div>
            <p>${order.heartMessage}</p>
          </div>
          ` : ''}

          ${order.familyNames ? `
          <div class="section">
            <div class="section-title">👨‍👩‍👧‍👦 Familiares para mencionar</div>
            <p>${order.familyNames}</p>
          </div>
          ` : ''}

          ${order.occasion === 'cha-revelacao' || order.occasion === 'cha-bebe' ? `
          <div class="section">
            <div class="section-title">🎀 Informacoes do Cha</div>
            ${order.knowsBabySex === 'sim' ? `
              <p><strong>Sexo:</strong> ${order.babySex === 'menino' ? '💙 Menino' : '💖 Menina'}</p>
              <p><strong>Nome do bebe:</strong> ${order.babySex === 'menino' ? order.babyNameBoy : order.babyNameGirl}</p>
            ` : `
              <p><strong>Os pais nao sabem o sexo</strong></p>
              <p><strong>Nome se menino:</strong> ${order.babyNameBoy || 'Nao informado'}</p>
              <p><strong>Nome se menina:</strong> ${order.babyNameGirl || 'Nao informado'}</p>
            `}
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">📝 Letra Aprovada pelo Cliente</div>
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
        from: process.env.RESEND_FROM_EMAIL || 'Melodia Rara <contato@melodiarara.com.br>',
        to: [ADMIN_EMAIL],
        subject: `🎵 Novo Pedido #${order.id} - R$ ${order.amount.toFixed(2).replace('.', ',')} (${paymentMethodLabel})`,
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

// E-mail de confirmacao para o cliente
export async function sendCustomerConfirmation(order: Order): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY nao configurada');
    return false;
  }

  if (!order.customerEmail) {
    console.error('E-mail do cliente nao informado');
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
        .header p { margin: 0; opacity: 0.9; font-size: 16px; }
        .check-icon { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .order-box { background: #f9f7f3; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .order-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
        .order-row:last-child { border-bottom: none; }
        .order-label { color: #6b7280; }
        .order-value { font-weight: 600; color: #1a1a1a; }
        .highlight-box { background: #f5f3ef; border: 2px solid #1a1a1a; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .highlight-box h3 { color: #1a1a1a; margin: 0 0 10px 0; }
        .highlight-box p { color: #1a1a1a; margin: 0; }
        .steps { margin: 30px 0; }
        .step { display: flex; align-items: flex-start; margin-bottom: 15px; }
        .step-number { width: 30px; height: 30px; background: #1a1a1a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
        .step-content h4 { margin: 0 0 5px 0; color: #1a1a1a; }
        .step-content p { margin: 0; color: #6b7280; font-size: 14px; }
        .footer { text-align: center; padding: 30px; background: #f9f7f3; }
        .footer p { margin: 5px 0; color: #6b7280; font-size: 14px; }
        .social-links { margin-top: 15px; }
        .social-links a { color: #1a1a1a; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="check-icon">✓</div>
            <h1>Pedido Confirmado!</h1>
            <p>Sua musica personalizada esta a caminho</p>
          </div>

          <div class="content">
            <p class="greeting">Ola, <strong>${order.customerName || 'Cliente'}</strong>!</p>

            <p>Recebemos seu pedido e estamos muito felizes em criar essa musica especial para voce. Nossa equipe ja esta trabalhando com carinho para transformar sua historia em uma cancao emocionante.</p>

            <div class="order-box">
              <div class="order-row">
                <span class="order-label">Pedido</span>
                <span class="order-value">#${order.id}</span>
              </div>
              ${order.planoNome ? `
              <div class="order-row">
                <span class="order-label">Plano</span>
                <span class="order-value">${order.planoNome}</span>
              </div>
              ` : ''}
              <div class="order-row">
                <span class="order-label">Para quem</span>
                <span class="order-value">${order.honoreeName}</span>
              </div>
              <div class="order-row">
                <span class="order-label">Ocasiao</span>
                <span class="order-value">${order.occasionLabel}</span>
              </div>
              <div class="order-row">
                <span class="order-label">Estilo Musical${order.planoMelodias && order.planoMelodias > 1 ? ' 1ª' : ''}</span>
                <span class="order-value">${order.musicStyleLabel}</span>
              </div>
              ${order.planoMelodias && order.planoMelodias > 1 ? `
              <div class="order-row">
                <span class="order-label">Estilo Musical 2ª</span>
                <span class="order-value">${order.musicStyle2Label || order.musicStyleLabel}</span>
              </div>
              ` : ''}
              <div class="order-row">
                <span class="order-label">Valor</span>
                <span class="order-value" style="color: #059669;">R$ ${order.amount.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div class="highlight-box">
              <h3>⏰ Prazo de Entrega</h3>
              <p><strong>Ate ${order.planoEntrega || '48 horas'}</strong> voce recebera sua${order.planoMelodias && order.planoMelodias > 1 ? 's' : ''} musica${order.planoMelodias && order.planoMelodias > 1 ? 's' : ''}!</p>
            </div>

            <div class="steps">
              <h3 style="margin-bottom: 20px;">Proximos Passos:</h3>

              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Criacao da Musica</h4>
                  <p>Nossa equipe esta criando sua musica personalizada com base na letra que voce aprovou.</p>
                </div>
              </div>

              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Voce Recebe ${order.planoMelodias || 1} ${order.planoMelodias && order.planoMelodias > 1 ? 'Versoes' : 'Versao'}</h4>
                  <p>${order.planoMelodias && order.planoMelodias > 1 ? `Enviaremos ${order.planoMelodias} melodias diferentes para voce escolher a que mais combina!` : 'Enviaremos sua melodia exclusiva pronta para emocionar!'}</p>
                </div>
              </div>

              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Entrega por WhatsApp</h4>
                  <p>Voce recebera a${order.planoMelodias && order.planoMelodias > 1 ? 's' : ''} musica${order.planoMelodias && order.planoMelodias > 1 ? 's' : ''} diretamente no seu WhatsApp em ate ${order.planoEntrega || '48 horas'}.</p>
                </div>
              </div>
            </div>

            <p style="text-align: center; color: #6b7280;">
              Alguma duvida? Responda este e-mail ou entre em contato pelo Instagram!
            </p>
          </div>

          <div class="footer">
            <p><strong>Melodia Rara</strong></p>
            <p>Transformando sentimentos em musica</p>
            <div class="social-links">
              <a href="https://instagram.com/melodiarara">@melodiarara</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
              Este e um e-mail automatico. Por favor, nao responda diretamente.
            </p>
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
        from: process.env.RESEND_FROM_EMAIL || 'Melodia Rara <contato@melodiarara.com.br>',
        to: [order.customerEmail],
        subject: `✅ Pedido Confirmado! Sua musica para ${order.honoreeName} esta sendo criada`,
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
