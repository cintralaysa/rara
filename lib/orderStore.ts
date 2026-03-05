// Armazenamento de pedidos usando Upstash Redis REST API
// Para funcionar no Vercel com multiplas instancias

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// TTLs em segundos
const ORDER_TTL = 604800;    // 7 dias
const ORDER_READY_TTL = 2592000; // 30 dias (musica pronta)
const ACCESS_TTL = 2592000;  // 30 dias
const TASK_TTL = 3600;       // 1 hora
const UPSELL_TTL = 7200;     // 2 horas

export type OrderStatus = 'pending' | 'paid' | 'generating' | 'ready' | 'failed';

export interface SongData {
  taskId: string;
  title?: string;
  audioUrl?: string;
  status: 'queued' | 'generating' | 'ready' | 'failed';
  createdAt: number;
  completedAt?: number;
  error?: string;
}

export interface OrderData {
  orderId: string;
  correlationID: string; // mantido para compatibilidade com pedidos antigos
  amount: number;
  status: OrderStatus;
  // Dados do cliente
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  // Dados da homenagem
  honoreeName: string;
  relationship: string;
  relationshipLabel: string;
  occasion: string;
  occasionLabel: string;
  musicStyle: string;
  musicStyleLabel: string;
  musicStyle2?: string;
  musicStyle2Label?: string;
  voicePreference: string;
  storyAndMessage?: string;
  qualities?: string;
  memories?: string;
  heartMessage?: string;
  familyNames?: string;
  generatedLyrics?: string;
  approvedLyrics?: string;
  // Cha de bebe
  knowsBabySex?: string;
  babySex?: string;
  babyNameBoy?: string;
  babyNameGirl?: string;
  // Timestamps
  createdAt: number;
  // Plano
  planoId?: string;
  planoNome?: string;
  planoMelodias?: number;
  planoEntrega?: string;
  // Pagamento
  paymentMethod?: string;
  paymentId?: string;
  emailSentAt?: number;
  // Musica - geracao automatica
  accessCode?: string; // CANTOS-XXXX
  creditsTotal?: number;
  creditsUsed?: number;
  songs?: SongData[];
  sunoTasks?: string[]; // taskIds do Suno
  musicUrls?: string[];
  musicStatus?: 'pending' | 'generating' | 'ready' | 'failed';
  musicEmailSentAt?: number;
  // Upsell
  upsellPurchased?: boolean;
}

// === Helper interno para fetch no Upstash ===
async function redisCommand(path: string, method: 'GET' | 'POST' = 'GET', body?: string): Promise<any> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    throw new Error('Upstash nao configurado');
  }

  const response = await fetch(`${UPSTASH_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${UPSTASH_TOKEN}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body } : {}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Redis error: ${errorText}`);
  }

  return response.json();
}

// === CRUD de Pedidos ===

export async function saveOrder(orderId: string, orderData: Partial<OrderData>): Promise<boolean> {
  try {
    const data: OrderData = {
      correlationID: orderId,
      status: 'pending',
      creditsTotal: 0,
      creditsUsed: 0,
      songs: [],
      sunoTasks: [],
      musicUrls: [],
      ...orderData,
      orderId,
      createdAt: orderData.createdAt || Date.now(),
    } as OrderData;

    await redisCommand(`/set/order:${orderId}?EX=${ORDER_TTL}`, 'POST', JSON.stringify(data));
    console.log(`[ORDER-STORE] Pedido salvo: ${orderId}`);
    return true;
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao salvar pedido:', error);
    return false;
  }
}

export async function getOrder(orderId: string): Promise<OrderData | null> {
  try {
    const result = await redisCommand(`/get/order:${orderId}`);

    if (!result.result) {
      return null;
    }

    return typeof result.result === 'string'
      ? JSON.parse(result.result)
      : result.result;
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao buscar pedido:', error);
    return null;
  }
}

export async function updateOrder(orderId: string, updates: Partial<OrderData>): Promise<boolean> {
  try {
    const existing = await getOrder(orderId);
    if (!existing) {
      console.error(`[ORDER-STORE] Pedido nao encontrado para update: ${orderId}`);
      return false;
    }

    const updated = { ...existing, ...updates };

    // Usar TTL maior se musica esta pronta
    const ttl = updated.musicStatus === 'ready' ? ORDER_READY_TTL : ORDER_TTL;

    await redisCommand(`/set/order:${orderId}?EX=${ttl}`, 'POST', JSON.stringify(updated));
    console.log(`[ORDER-STORE] Pedido atualizado: ${orderId}`);
    return true;
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao atualizar pedido:', error);
    return false;
  }
}

export async function removeOrder(orderId: string): Promise<boolean> {
  try {
    await redisCommand(`/del/order:${orderId}`, 'POST');
    console.log(`[ORDER-STORE] Pedido removido: ${orderId}`);
    return true;
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao remover pedido:', error);
    return false;
  }
}

// === Access Codes (CANTOS-XXXX) ===

export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem I/O/0/1 para evitar confusao
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CANTOS-${code}`;
}

export async function saveAccessCode(code: string, orderId: string): Promise<boolean> {
  try {
    await redisCommand(`/set/access:${code}?EX=${ACCESS_TTL}`, 'POST', JSON.stringify(orderId));
    console.log(`[ORDER-STORE] Access code salvo: ${code} -> ${orderId}`);
    return true;
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao salvar access code:', error);
    return false;
  }
}

export async function getOrderByAccessCode(code: string): Promise<OrderData | null> {
  try {
    const result = await redisCommand(`/get/access:${code}`);
    if (!result.result) return null;

    const orderId = typeof result.result === 'string'
      ? JSON.parse(result.result)
      : result.result;

    return getOrder(orderId);
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao buscar por access code:', error);
    return null;
  }
}

// === Task Mapping (Suno taskId -> orderId) ===

export async function saveTaskMapping(taskId: string, orderId: string): Promise<boolean> {
  try {
    await redisCommand(`/set/task:${taskId}?EX=${TASK_TTL}`, 'POST', JSON.stringify(orderId));
    return true;
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao salvar task mapping:', error);
    return false;
  }
}

export async function getOrderByTaskId(taskId: string): Promise<OrderData | null> {
  try {
    const result = await redisCommand(`/get/task:${taskId}`);
    if (!result.result) return null;

    const orderId = typeof result.result === 'string'
      ? JSON.parse(result.result)
      : result.result;

    return getOrder(orderId);
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao buscar por taskId:', error);
    return null;
  }
}

// === Upsell Mapping ===

export async function saveUpsellMapping(upsellId: string, orderId: string): Promise<boolean> {
  try {
    await redisCommand(`/set/upsell:${upsellId}?EX=${UPSELL_TTL}`, 'POST', JSON.stringify(orderId));
    return true;
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao salvar upsell mapping:', error);
    return false;
  }
}

export async function getOrderByUpsellId(upsellId: string): Promise<OrderData | null> {
  try {
    const result = await redisCommand(`/get/upsell:${upsellId}`);
    if (!result.result) return null;

    const orderId = typeof result.result === 'string'
      ? JSON.parse(result.result)
      : result.result;

    return getOrder(orderId);
  } catch (error) {
    console.error('[ORDER-STORE] Erro ao buscar por upsellId:', error);
    return null;
  }
}
