// Cliente para Suno API (sunoapi.org)
// Gera musicas automaticamente a partir de letras

const SUNO_API_KEY = process.env.SUNO_API_KEY || '';
const SUNO_BASE_URL = 'https://api.sunoapi.org/api/v1';

export interface SunoGenerateParams {
  lyrics: string;
  style: string;
  title: string;
  vocalGender?: 'm' | 'f';
  callbackUrl?: string;
}

export interface SunoSongData {
  id: string;
  audioUrl: string;
  streamAudioUrl: string;
  imageUrl: string;
  prompt: string;
  title: string;
  tags: string;
  duration: number;
}

export interface SunoTaskResult {
  taskId: string;
  status: string;
  songs: SunoSongData[];
  errorCode?: string;
  errorMessage?: string;
}

// Gerar musica via Suno API
export async function generateSong(params: SunoGenerateParams): Promise<{ taskId: string }> {
  if (!SUNO_API_KEY) {
    throw new Error('SUNO_API_KEY nao configurado');
  }

  const response = await fetch(`${SUNO_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUNO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customMode: true,
      instrumental: false,
      model: 'V4_5ALL',
      prompt: params.lyrics,
      style: params.style,
      title: params.title,
      vocalGender: params.vocalGender || 'f',
      ...(params.callbackUrl ? { callBackUrl: params.callbackUrl } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[SUNO] Erro na geracao:', response.status, errorText);
    throw new Error(`Suno API error ${response.status}: ${errorText}`);
  }

  const result = await response.json();

  if (result.code !== 200 || !result.data?.taskId) {
    throw new Error(`Suno API error: ${result.msg || 'Resposta invalida'}`);
  }

  console.log(`[SUNO] Task criada: ${result.data.taskId}`);
  return { taskId: result.data.taskId };
}

// Verificar status de uma task
export async function checkTaskStatus(taskId: string): Promise<SunoTaskResult> {
  if (!SUNO_API_KEY) {
    throw new Error('SUNO_API_KEY nao configurado');
  }

  const response = await fetch(
    `${SUNO_BASE_URL}/generate/record-info?taskId=${taskId}`,
    {
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Suno status error ${response.status}`);
  }

  const result = await response.json();
  const data = result.data;

  if (!data) {
    throw new Error('Suno: resposta sem dados');
  }

  const songs: SunoSongData[] = [];

  if (data.status === 'SUCCESS' && data.response?.sunoData) {
    for (const song of data.response.sunoData) {
      songs.push({
        id: song.id,
        audioUrl: fixAudioUrl(song.audioUrl),
        streamAudioUrl: song.streamAudioUrl || '',
        imageUrl: song.imageUrl || '',
        prompt: song.prompt || '',
        title: song.title || '',
        tags: song.tags || '',
        duration: song.duration || 0,
      });
    }
  }

  return {
    taskId: data.taskId,
    status: data.status,
    songs,
    errorCode: data.errorCode || undefined,
    errorMessage: data.errorMessage || undefined,
  };
}

// Corrigir URL do audio para usar CDN confiavel
function fixAudioUrl(url: string): string {
  if (!url) return '';
  // Preferir cdn1.suno.ai em vez de audiopipe.suno.ai
  return url.replace('audiopipe.suno.ai', 'cdn1.suno.ai');
}

// Status finais (nao precisa mais poll)
export function isTerminalStatus(status: string): boolean {
  return [
    'SUCCESS',
    'CREATE_TASK_FAILED',
    'GENERATE_AUDIO_FAILED',
    'CALLBACK_EXCEPTION',
    'SENSITIVE_WORD_ERROR',
  ].includes(status);
}

export function isFailedStatus(status: string): boolean {
  return [
    'CREATE_TASK_FAILED',
    'GENERATE_AUDIO_FAILED',
    'SENSITIVE_WORD_ERROR',
  ].includes(status);
}
