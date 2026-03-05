// Orquestracao da geracao de musica
// Conecta pedidos, Suno AI, e entrega

import { generateSong, SunoGenerateParams } from './sunoClient';
import { schedulePoll } from './qstash';
import {
  getOrder,
  updateOrder,
  saveTaskMapping,
  generateAccessCode,
  saveAccessCode,
  OrderData,
  SongData,
} from './orderStore';

const CALLBACK_URL = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiarara.com'}/api/music/callback`;

// Mapear estilo do formulario para tag do Suno
const STYLE_MAP: Record<string, string> = {
  sertanejo: 'Sertanejo, Romantic, Brazilian',
  pop: 'Pop, Brazilian Pop, Upbeat',
  mpb: 'MPB, Bossa Nova, Brazilian',
  gospel: 'Gospel, Worship, Inspirational',
  rock: 'Soft Rock, Romantic Rock, Ballad',
  pagode: 'Pagode, Samba, Brazilian Party',
  forro: 'Forró, Northeastern Brazilian, Festive',
  classica: 'Classical, Piano, Orchestral',
  hiphop: 'Hip Hop, Rap, Brazilian Rap',
  eletronica: 'Electronic, EDM, Dance',
  infantil: 'Children, Lullaby, Sweet, Gentle',
  jazz: 'Jazz, Smooth Jazz, Romantic',
  reggae: 'Reggae, Relaxed, Caribbean',
  funk: 'Funk Brasileiro, Funk Melody, Brazilian',
  country: 'Country, Acoustic, Folk',
  bossa: 'Bossa Nova, Jazz, Brazilian',
};

// Mapear preferencia de voz
function getVocalGender(voicePreference: string): 'm' | 'f' {
  if (voicePreference === 'masculina') return 'm';
  return 'f'; // feminina ou qualquer outro
}

// Construir titulo da musica
function buildSongTitle(order: OrderData, songIndex: number): string {
  const base = order.honoreeName
    ? `Para ${order.honoreeName}`
    : 'Melodia Rara';

  if ((order.planoMelodias || 2) > 1) {
    return `${base} (Versão ${songIndex + 1})`;
  }
  return base;
}

// Construir estilo da musica
function buildSunoStyle(order: OrderData): string {
  const styles: string[] = [];

  // Estilo principal
  const mainStyle = STYLE_MAP[order.musicStyle] || order.musicStyleLabel || 'Pop, Brazilian';
  styles.push(mainStyle);

  // Estilo secundario (se houver)
  if (order.musicStyle2 && STYLE_MAP[order.musicStyle2]) {
    styles.push(STYLE_MAP[order.musicStyle2]);
  }

  // Adicionar contexto da ocasiao
  const occasionStyles: Record<string, string> = {
    aniversario: 'Celebratory, Birthday',
    casamento: 'Wedding, Romantic, Love',
    dia_maes: 'Emotional, Heartfelt, Mother',
    dia_pais: 'Emotional, Father, Tribute',
    natal: 'Christmas, Festive, Holiday',
    formatura: 'Graduation, Triumphant',
    nascimento: 'Lullaby, Gentle, New Life',
    cha_bebe: 'Lullaby, Sweet, Baby Shower',
    declaracao: 'Love Song, Romantic, Passionate',
    homenagem: 'Tribute, Emotional, Memorial',
    corporativo: 'Corporate, Professional, Upbeat',
  };

  if (order.occasion && occasionStyles[order.occasion]) {
    styles.push(occasionStyles[order.occasion]);
  }

  return styles.join(', ');
}

// Iniciar geracao de musica para um pedido
export async function startMusicGeneration(orderId: string): Promise<boolean> {
  const order = await getOrder(orderId);
  if (!order) {
    console.error(`[MUSIC-GEN] Pedido nao encontrado: ${orderId}`);
    return false;
  }

  if (order.status !== 'paid') {
    console.error(`[MUSIC-GEN] Pedido nao esta pago: ${orderId} (status: ${order.status})`);
    return false;
  }

  const totalSongs = order.planoMelodias || 2;
  const lyrics = order.generatedLyrics || order.approvedLyrics || '';

  if (!lyrics) {
    console.error(`[MUSIC-GEN] Pedido sem letra: ${orderId}`);
    await updateOrder(orderId, { status: 'failed', musicStatus: 'failed' });
    return false;
  }

  // Gerar access code
  const accessCode = generateAccessCode();
  await saveAccessCode(accessCode, orderId);

  // Atualizar status para generating
  await updateOrder(orderId, {
    status: 'generating',
    musicStatus: 'generating',
    accessCode,
    creditsTotal: totalSongs,
    creditsUsed: 0,
  });

  const style = buildSunoStyle(order);
  const vocalGender = getVocalGender(order.voicePreference);

  // Para plano basico: 1 request = 2 musicas, usamos a melhor
  // Para plano premium: 2 requests = 4 musicas, escolhemos 3
  const numRequests = totalSongs <= 2 ? 1 : Math.ceil(totalSongs / 2);

  const allTasks: string[] = [];
  const allSongs: SongData[] = [];

  for (let i = 0; i < numRequests; i++) {
    try {
      const title = buildSongTitle(order, i);

      const params: SunoGenerateParams = {
        lyrics,
        style,
        title,
        vocalGender,
        callbackUrl: CALLBACK_URL,
      };

      const { taskId } = await generateSong(params);
      allTasks.push(taskId);

      // Salvar mapping taskId -> orderId no Redis
      await saveTaskMapping(taskId, orderId);

      // Criar song entries (2 por request)
      for (let j = 0; j < 2; j++) {
        allSongs.push({
          taskId,
          status: 'queued',
          createdAt: Date.now(),
        });
      }

      // Agendar polling para este task
      await schedulePoll(orderId, taskId, 0);

      console.log(`[MUSIC-GEN] Task ${i + 1}/${numRequests} criada: ${taskId}`);
    } catch (error) {
      console.error(`[MUSIC-GEN] Erro ao criar task ${i + 1}:`, error);
    }
  }

  if (allTasks.length === 0) {
    await updateOrder(orderId, { status: 'failed', musicStatus: 'failed' });
    return false;
  }

  // Salvar tasks e songs no pedido
  await updateOrder(orderId, {
    sunoTasks: allTasks,
    songs: allSongs,
  });

  console.log(`[MUSIC-GEN] Geracao iniciada para ${orderId}: ${allTasks.length} tasks, ${allSongs.length} songs`);
  return true;
}

// Quando uma musica fica pronta (chamado pelo poll ou callback)
export async function handleSongComplete(
  orderId: string,
  taskId: string,
  audioUrls: Array<{ id: string; audioUrl: string; imageUrl?: string; title?: string; duration?: number }>
): Promise<void> {
  const order = await getOrder(orderId);
  if (!order) {
    console.error(`[MUSIC-GEN] Pedido nao encontrado ao completar: ${orderId}`);
    return;
  }

  const songs = order.songs || [];
  const musicUrls = order.musicUrls || [];
  const totalNeeded = order.planoMelodias || 2;

  // Atualizar songs que pertencem a este taskId
  for (const audio of audioUrls) {
    // Encontrar song entry correspondente
    const songIndex = songs.findIndex(s => s.taskId === taskId && s.status !== 'ready');
    if (songIndex >= 0) {
      songs[songIndex] = {
        ...songs[songIndex],
        status: 'ready',
        audioUrl: audio.audioUrl,
        title: audio.title,
        completedAt: Date.now(),
      };
      musicUrls.push(audio.audioUrl);
    }
  }

  // Verificar se temos musicas suficientes
  const readySongs = songs.filter(s => s.status === 'ready');
  const allDone = readySongs.length >= totalNeeded;

  const updates: Partial<OrderData> = {
    songs,
    musicUrls: musicUrls.slice(0, totalNeeded), // limitar ao numero contratado
  };

  if (allDone) {
    updates.status = 'ready';
    updates.musicStatus = 'ready';
    updates.creditsUsed = totalNeeded;
    console.log(`[MUSIC-GEN] Todas as musicas prontas para ${orderId}!`);
  }

  await updateOrder(orderId, updates);

  // Se todas prontas, enviar email de entrega
  if (allDone) {
    try {
      const { sendMusicDeliveryEmail } = await import('./email');
      await sendMusicDeliveryEmail(order);
      await updateOrder(orderId, { musicEmailSentAt: Date.now() });
    } catch (error) {
      console.error(`[MUSIC-GEN] Erro ao enviar email de entrega:`, error);
    }
  }
}

// Quando geracao falha
export async function handleSongFailed(
  orderId: string,
  taskId: string,
  errorMessage: string
): Promise<void> {
  const order = await getOrder(orderId);
  if (!order) return;

  const songs = (order.songs || []).map(s =>
    s.taskId === taskId ? { ...s, status: 'failed' as const, error: errorMessage } : s
  );

  // Se TODAS as songs falharam, marcar pedido como failed
  const allFailed = songs.every(s => s.status === 'failed');

  await updateOrder(orderId, {
    songs,
    ...(allFailed ? { status: 'failed', musicStatus: 'failed' } : {}),
  });

  if (allFailed) {
    console.error(`[MUSIC-GEN] Todas as musicas falharam para ${orderId}: ${errorMessage}`);
    // TODO: notificar admin
  }
}
