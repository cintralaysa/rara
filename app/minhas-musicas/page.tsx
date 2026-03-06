'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Music, KeyRound, Loader2, ArrowLeft, Headphones, Mail, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function MinhasMusicas() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!accessCode.trim()) {
      setError('Digite seu codigo de acesso');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/music/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Codigo nao encontrado');
        setLoading(false);
        return;
      }
      router.push(`/musica/${data.orderId}`);
    } catch {
      setError('Erro de conexao. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-50 relative">
      {/* Header */}
      <header className="bg-white border-b-2 border-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-dark-900 hover:text-wine-500 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-lg font-black text-dark-900 uppercase tracking-wide">Melodia Rara</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-wine-500 flex items-center justify-center mx-auto mb-6 border-2 border-dark-900 shadow-offset">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-dark-900 uppercase tracking-wide mb-3">
            Minhas Músicas
          </h2>
          <p className="text-dark-600 font-medium text-base sm:text-lg">
            Digite o codigo de acesso que voce recebeu por email para ouvir e baixar suas melodias.
          </p>
        </motion.div>

        {/* Access Code Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border-2 border-dark-900 shadow-offset p-6 sm:p-8 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-wine-500" />
            <span className="font-black text-dark-900 text-sm uppercase tracking-wide">Codigo de Acesso</span>
          </div>

          <input
            type="text"
            value={accessCode}
            onChange={(e) => { setAccessCode(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="RARA-XXXX"
            className="w-full px-6 py-4 border-2 border-dark-900 rounded-xl font-mono font-black text-dark-900 text-center text-2xl tracking-[0.3em] placeholder:text-dark-300 placeholder:tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-wine-500 mb-4"
            maxLength={9}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-bold w-full px-6 py-4 bg-dark-900 text-white text-base"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Music className="w-5 h-5" />
                Acessar Minhas Músicas
              </>
            )}
          </button>

          {error && (
            <p className="text-red-500 text-sm font-bold mt-3 text-center">{error}</p>
          )}
        </motion.div>

        {/* Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border-2 border-dark-900/20 p-6"
        >
          <h3 className="font-black text-dark-900 text-sm uppercase tracking-wide mb-4">Onde encontro meu codigo?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-wine-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-dark-600 font-medium">
                Verifique o email que voce usou na compra. O codigo (ex: <span className="font-mono font-bold text-dark-900">RARA-AB12</span>) foi enviado junto com a confirmacao.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Headphones className="w-5 h-5 text-wine-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-dark-600 font-medium">
                Se sua musica ainda esta sendo gerada, aguarde alguns minutos e tente novamente.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Instagram */}
        <div className="text-center mt-8">
          <a
            href="https://instagram.com/melodiarara"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-dark-500 hover:text-wine-500 transition-colors font-bold text-sm"
          >
            <Instagram className="w-4 h-4" />
            @melodiarara
          </a>
        </div>
      </div>
    </div>
  );
}
