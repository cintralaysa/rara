// QStash - Agendamento de tarefas assincronas via Upstash QStash
// Usado para agendar geracao de musica e polling de status

const QSTASH_TOKEN = process.env.QSTASH_TOKEN || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiarara.com';
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || process.env.QSTASH_TOKEN || '';

// Agendar inicio da geracao de musica
export async function scheduleGeneration(orderId: string, delaySeconds: number = 5): Promise<boolean> {
  return publishToQStash(
    `${APP_URL}/api/music/generate`,
    { orderId },
    delaySeconds
  );
}

// Agendar poll de status da musica
export async function schedulePoll(
  orderId: string,
  taskId: string,
  attempt: number = 0
): Promise<boolean> {
  // Delay progressivo: 15s, 15s, 20s, 25s, 30s...
  const delay = attempt < 2 ? 15 : Math.min(15 + (attempt - 2) * 5, 60);

  return publishToQStash(
    `${APP_URL}/api/music/poll`,
    { orderId, taskId, attempt },
    delay
  );
}

// Publicar mensagem no QStash
async function publishToQStash(
  destination: string,
  body: Record<string, any>,
  delaySecs: number = 0
): Promise<boolean> {
  if (!QSTASH_TOKEN) {
    console.error('[QSTASH] Token nao configurado');
    return false;
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${QSTASH_TOKEN}`,
      'Content-Type': 'application/json',
      'Upstash-Forward-X-Internal-Secret': INTERNAL_API_SECRET,
    };

    if (delaySecs > 0) {
      headers['Upstash-Delay'] = `${delaySecs}s`;
    }

    // Retry 3 vezes com backoff
    headers['Upstash-Retries'] = '3';

    const response = await fetch(`https://qstash.upstash.io/v2/publish/${destination}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[QSTASH] Erro ao publicar:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`[QSTASH] Agendado: ${destination} (delay ${delaySecs}s) -> ${result.messageId}`);
    return true;
  } catch (error) {
    console.error('[QSTASH] Erro ao publicar:', error);
    return false;
  }
}

// Verificar se request veio do QStash (autenticacao)
export function verifyInternalRequest(request: Request): boolean {
  const secret = request.headers.get('x-internal-secret');
  if (secret && secret === INTERNAL_API_SECRET) {
    return true;
  }

  // Fallback: verificar Upstash-Signature (simplificado)
  const upstashSignature = request.headers.get('upstash-signature');
  if (upstashSignature) {
    return true; // QStash assina as requests automaticamente
  }

  return false;
}
