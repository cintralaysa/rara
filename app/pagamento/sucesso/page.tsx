'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Music, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { trackPurchase } from '@/components/MetaPixel';

interface PlanoInfo {
  id: string;
  nome: string;
  melodias: number;
  entrega: string;
  preco: number;
}

function SucessoContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [customerName, setCustomerName] = useState('');
  const [honoreeName, setHonoreeName] = useState('');
  const [planoInfo, setPlanoInfo] = useState<PlanoInfo>({
    id: 'basico',
    nome: 'Plano Basico',
    melodias: 1,
    entrega: 'em ate 48 horas',
    preco: 39.90,
  });

  useEffect(() => {
    // Recuperar dados do localStorage
    const checkoutData = localStorage.getItem('checkoutData');
    const planoData = localStorage.getItem('planoInfo');

    if (checkoutData) {
      try {
        const parsed = JSON.parse(checkoutData);
        setCustomerName(parsed.name || '');
        setHonoreeName(parsed.honoreeName || '');
      } catch { /* ignore */ }
    }

    if (planoData) {
      try {
        setPlanoInfo(JSON.parse(planoData));
      } catch { /* ignore */ }
    }

    // Meta Pixel Purchase event
    if (planoData) {
      try {
        const plano = JSON.parse(planoData);
        trackPurchase(orderId || '', plano.preco || 39.90, plano.id || 'basico');
      } catch { /* ignore */ }
    }

    // Limpar dados de checkout
    localStorage.removeItem('checkoutData');
    localStorage.removeItem('planoInfo');
    localStorage.removeItem('cupomAplicado');
    localStorage.removeItem('pendingOrder');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center border-2 border-dark-900 shadow-offset"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 border-2 border-dark-900"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-3xl font-black text-dark-900 mb-4 uppercase tracking-wide">
          Pagamento Confirmado!
        </h1>

        <p className="text-dark-600 mb-4 font-medium">
          {customerName ? `${customerName}, seu` : 'Seu'} pedido foi recebido com sucesso!
          {honoreeName && ` A musica para ${honoreeName} esta a caminho.`}
        </p>

        {orderId && (
          <p className="text-sm text-dark-500 mb-4 font-mono">
            Pedido: {orderId}
          </p>
        )}

        {/* Badge do plano */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-soft-100 rounded-full border-2 border-dark-900 shadow-offset-sm mb-8">
          <Music className="w-4 h-4 text-wine-500" />
          <span className="font-black text-dark-900">{planoInfo.nome}</span>
          <span className="text-dark-600 font-bold">{planoInfo.melodias} melodia{planoInfo.melodias > 1 ? 's' : ''}</span>
        </div>

        <div className="bg-soft-100 rounded-2xl p-6 mb-8 border-2 border-dark-900">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-wine-500" />
            <span className="font-black text-dark-900 uppercase tracking-wide">Proximos passos</span>
          </div>
          <ul className="text-left text-dark-600 space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="font-medium">Voce recebera um e-mail de confirmacao</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-wine-500 flex-shrink-0 mt-0.5" />
              <span className="font-medium">Sua musica sera criada automaticamente</span>
            </li>
            <li className="flex items-start gap-3">
              <Music className="w-5 h-5 text-wine-500 flex-shrink-0 mt-0.5" />
              <span className="font-medium">
                Em ate {planoInfo.entrega} voce recebera sua{planoInfo.melodias > 1 ? 's' : ''} musica{planoInfo.melodias > 1 ? 's' : ''} pronta{planoInfo.melodias > 1 ? 's' : ''}
              </span>
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="btn-bold px-8 py-4 bg-dark-900 text-white text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao inicio
        </Link>
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
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

export default function SucessoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SucessoContent />
    </Suspense>
  );
}
