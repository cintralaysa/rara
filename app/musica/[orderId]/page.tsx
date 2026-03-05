'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Music, Loader2, AlertCircle, Gift, Sparkles } from 'lucide-react';
import Link from 'next/link';
import MusicPlayer from '@/components/MusicPlayer';

interface MusicStatus {
  orderId: string;
  status: string;
  musicStatus: string;
  accessCode?: string;
  honoreeName: string;
  occasion: string;
  musicStyle: string;
  planoNome: string;
  totalSongs: number;
  readyCount: number;
  progress: number;
  songs: Array<{ audioUrl: string; title?: string; completedAt?: number }>;
  musicUrls: string[];
}

export default function MusicaPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [data, setData] = useState<MusicStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/music/status/${orderId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Pedido nao encontrado');
        } else {
          setError('Erro ao carregar');
        }
        setLoading(false);
        return;
      }
      const result = await res.json();
      setData(result);
      setLoading(false);
    } catch {
      setError('Erro de conexao');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [orderId]);

  // Polling se ainda gerando
  useEffect(() => {
    if (!data || data.musicStatus === 'ready' || data.musicStatus === 'failed') return;

    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [data?.musicStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-dark-900 flex items-center justify-center mx-auto mb-6 border-2 border-dark-900 animate-pulse">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-dark-900">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border-2 border-dark-900 shadow-offset p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-dark-900 mb-2">{error}</h1>
          <p className="text-dark-600 mb-6">Verifique o link ou entre em contato conosco.</p>
          <Link href="/" className="btn-bold px-6 py-3 bg-dark-900 text-white">
            Voltar ao inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  const isGenerating = data.musicStatus === 'generating' || data.musicStatus === 'pending';
  const isReady = data.musicStatus === 'ready';
  const isFailed = data.musicStatus === 'failed';

  return (
    <div className="min-h-screen bg-soft-100 p-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-dark-900 uppercase tracking-wide">
            Melodia Rara
          </h1>
          <p className="text-dark-600 font-bold mt-2">
            {data.honoreeName ? `Musica para ${data.honoreeName}` : 'Sua musica personalizada'}
          </p>
        </motion.div>

        {/* Generating state */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border-2 border-dark-900 shadow-offset p-8 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-wine-500 flex items-center justify-center mx-auto mb-6 border-2 border-dark-900 animate-pulse">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-dark-900 mb-3 uppercase">
              Criando sua musica...
            </h2>
            <p className="text-dark-600 font-medium mb-6">
              Nosso estudio de IA esta compondo sua musica personalizada.
              Isso geralmente leva de 2 a 5 minutos.
            </p>

            {/* Progress */}
            {data.totalSongs > 1 && (
              <div className="mb-4">
                <div className="h-4 bg-soft-200 rounded-full border border-dark-900 overflow-hidden">
                  <motion.div
                    className="h-full bg-wine-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-dark-500 mt-2 font-bold">
                  {data.readyCount} de {data.totalSongs} musicas prontas
                </p>
              </div>
            )}

            <div className="bg-soft-100 rounded-xl p-4 border border-dark-200">
              <p className="text-sm text-dark-500 font-medium">
                Esta pagina atualiza automaticamente. Voce tambem recebera um email quando estiver pronto.
              </p>
            </div>
          </motion.div>
        )}

        {/* Ready state - Player */}
        {isReady && data.songs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <MusicPlayer
              songs={data.songs.map(s => ({
                audioUrl: s.audioUrl,
                title: s.title,
              }))}
              honoreeName={data.honoreeName}
            />

            {/* Order details */}
            <div className="mt-6 bg-white rounded-2xl border-2 border-dark-900 shadow-offset p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-wine-500" />
                <h3 className="font-black text-dark-900 uppercase tracking-wide text-sm">Detalhes</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-bold text-dark-600">Homenageado:</span> <span className="text-dark-900 font-medium">{data.honoreeName}</span></p>
                <p><span className="font-bold text-dark-600">Ocasiao:</span> <span className="text-dark-900 font-medium">{data.occasion}</span></p>
                <p><span className="font-bold text-dark-600">Estilo:</span> <span className="text-dark-900 font-medium">{data.musicStyle}</span></p>
                <p><span className="font-bold text-dark-600">Plano:</span> <span className="text-dark-900 font-medium">{data.planoNome}</span></p>
              </div>

              {data.accessCode && (
                <div className="mt-4 p-3 bg-soft-100 rounded-xl border border-dark-200 text-center">
                  <p className="text-xs text-dark-500 font-bold uppercase">Codigo de Acesso</p>
                  <p className="text-lg font-black text-dark-900 font-mono tracking-wider">{data.accessCode}</p>
                </div>
              )}
            </div>

            {/* Upsell placeholder - Phase 6 */}
            <div className="mt-6 bg-gradient-to-br from-wine-500 to-wine-700 rounded-2xl border-2 border-dark-900 shadow-offset p-6 text-center text-white">
              <Gift className="w-10 h-10 mx-auto mb-3" />
              <h3 className="font-black text-lg uppercase tracking-wide mb-2">
                Quer mais uma musica?
              </h3>
              <p className="text-white/80 text-sm mb-4 font-medium">
                Adicione +1 melodia exclusiva por apenas R$19,90
              </p>
              <button
                className="px-6 py-3 bg-white text-wine-700 font-black rounded-xl border-2 border-dark-900 shadow-offset hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase text-sm"
                id="upsell-btn"
              >
                Adicionar Musica - R$19,90
              </button>
            </div>
          </motion.div>
        )}

        {/* Failed state */}
        {isFailed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border-2 border-dark-900 shadow-offset p-8 text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-dark-900 mb-3">
              Erro na geracao
            </h2>
            <p className="text-dark-600 mb-6">
              Houve um problema ao gerar sua musica. Nossa equipe foi notificada e entraremos em contato em breve.
            </p>
            <p className="text-sm text-dark-500 font-mono">Pedido: {data.orderId}</p>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-dark-500 hover:text-dark-900 font-bold text-sm transition-colors">
            melodiarara.com
          </Link>
        </div>
      </div>
    </div>
  );
}
