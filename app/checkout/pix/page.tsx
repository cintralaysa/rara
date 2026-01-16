'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Music,
  Loader2,
  RefreshCw,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import { COMPANY_INFO } from '@/lib/data';

interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  honoreeName: string;
  correlationID: string;
  qrCode: string;
  qrCodeBase64: string;
  pixCopyPaste: string;
  expiresAt: string;
}

interface PendingOrder {
  userName: string;
  email: string;
  whatsapp: string;
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
  storyAndMessage: string;
  familyNames: string;
  generatedLyrics: string;
  knowsBabySex?: string;
  babySex?: string;
  babyNameBoy?: string;
  babyNameGirl?: string;
  // Informacoes do plano
  planoId?: string;
  planoNome?: string;
  planoPreco?: number;
  planoPrecoCents?: number;
  planoMelodias?: number;
  planoEntrega?: string;
}

interface PlanoInfo {
  id: string;
  nome: string;
  melodias: number;
  entrega: string;
  preco: number;
}

export default function CheckoutPixPage() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [status, setStatus] = useState<'pending' | 'paid' | 'expired' | 'error' | 'loading'>('loading');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planoInfo, setPlanoInfo] = useState<PlanoInfo>({
    id: 'basico',
    nome: 'Plano Basico',
    melodias: 1,
    entrega: '48 horas',
    preco: 49.90
  });

  // Carregar dados do localStorage e criar PIX
  useEffect(() => {
    const createPixPayment = async () => {
      // Verificar se ja tem dados de checkout
      const existingData = localStorage.getItem('checkoutData');
      const existingPlanoData = localStorage.getItem('planoInfo');

      if (existingData) {
        setCheckoutData(JSON.parse(existingData));
        if (existingPlanoData) {
          setPlanoInfo(JSON.parse(existingPlanoData));
        }
        setStatus('pending');
        return;
      }

      // Buscar dados do pedido pendente
      const pendingOrderData = localStorage.getItem('pendingOrder');
      if (!pendingOrderData) {
        setError('Dados do pedido nao encontrados');
        setStatus('error');
        return;
      }

      const pendingOrder: PendingOrder = JSON.parse(pendingOrderData);

      // Carregar info do plano do pedido pendente
      if (pendingOrder.planoId) {
        setPlanoInfo({
          id: pendingOrder.planoId,
          nome: pendingOrder.planoNome || 'Plano Basico',
          melodias: pendingOrder.planoMelodias || 1,
          entrega: pendingOrder.planoEntrega || '48 horas',
          preco: pendingOrder.planoPreco || 49.90
        });
      }

      try {
        // Criar cobranca PIX
        const response = await fetch('/api/pix/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pendingOrder),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          setError(data.error || 'Erro ao criar PIX');
          setStatus('error');
          return;
        }

        // Atualizar info do plano com dados da API
        const planoFromApi: PlanoInfo = {
          id: data.plano?.id || pendingOrder.planoId || 'basico',
          nome: data.plano?.nome || pendingOrder.planoNome || 'Plano Basico',
          melodias: data.plano?.melodias || pendingOrder.planoMelodias || 1,
          entrega: data.plano?.entrega || pendingOrder.planoEntrega || '48 horas',
          preco: (data.pixData?.value || pendingOrder.planoPrecoCents || 4990) / 100
        };
        setPlanoInfo(planoFromApi);
        localStorage.setItem('planoInfo', JSON.stringify(planoFromApi));

        // Montar dados do checkout
        const checkout: CheckoutData = {
          name: pendingOrder.userName,
          email: pendingOrder.email,
          phone: pendingOrder.whatsapp,
          honoreeName: pendingOrder.honoreeName,
          correlationID: data.correlationID,
          qrCode: data.pixData?.qrCode || '',
          qrCodeBase64: data.pixData?.qrCodeBase64 || data.pixData?.qrCode || '',
          pixCopyPaste: data.pixData?.pixCopiaECola || '',
          expiresAt: data.pixData?.expiresAt || new Date(Date.now() + 3600000).toISOString(),
        };

        // Salvar e atualizar estado
        localStorage.setItem('checkoutData', JSON.stringify(checkout));
        localStorage.removeItem('pendingOrder');
        setCheckoutData(checkout);
        setStatus('pending');
      } catch (err) {
        console.error('Erro ao criar PIX:', err);
        setError('Erro de conexao. Tente novamente.');
        setStatus('error');
      }
    };

    createPixPayment();
  }, []);

  // Verificar status do pagamento
  const checkPaymentStatus = useCallback(async () => {
    if (!checkoutData?.correlationID) return;

    setIsChecking(true);
    try {
      const response = await fetch(`/api/pix/status?correlationID=${checkoutData.correlationID}`);
      const data = await response.json();

      if (data.isPaid) {
        setStatus('paid');
        localStorage.removeItem('checkoutData');
      } else if (data.isExpired) {
        setStatus('expired');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setIsChecking(false);
    }
  }, [checkoutData?.correlationID]);

  // Polling para verificar pagamento
  useEffect(() => {
    if (status !== 'pending' || !checkoutData) return;

    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [status, checkoutData, checkPaymentStatus]);

  // Countdown timer
  useEffect(() => {
    if (!checkoutData?.expiresAt || status !== 'pending') return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiresAt = new Date(checkoutData.expiresAt).getTime();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setStatus('expired');
        setTimeLeft('Expirado');
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [checkoutData?.expiresAt, status]);

  // Copiar código PIX
  const copyPixCode = async () => {
    if (!checkoutData?.pixCopyPaste) return;

    try {
      await navigator.clipboard.writeText(checkoutData.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Gerando PIX...</h1>
          <p className="text-slate-600">
            Aguarde enquanto preparamos seu pagamento
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error' || !checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {error || 'Sessao expirada'}
          </h1>
          <p className="text-slate-600 mb-6">
            Nao foi possivel processar seu pedido.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-900 text-amber-400 font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao inicio
          </Link>
        </div>
      </div>
    );
  }

  // Se pagamento confirmado
  if (status === 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Pagamento Confirmado!
          </h1>
          <p className="text-slate-600 mb-4">
            Seu pedido foi recebido com sucesso. Em breve voce recebera um e-mail com mais informacoes sobre a producao da sua musica.
          </p>

          {/* Badge do plano */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full border border-amber-300 mb-8">
            <Music className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-amber-700">{planoInfo.nome}</span>
            <span className="text-amber-600">•</span>
            <span className="text-amber-600">{planoInfo.melodias} melodia{planoInfo.melodias > 1 ? 's' : ''}</span>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-6 mb-8 border border-blue-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Music className="w-6 h-6 text-amber-500" />
              <span className="font-semibold text-slate-800">Proximos passos</span>
            </div>
            <ul className="text-left text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                Voce recebera um e-mail de confirmacao
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                Nossa equipe comecara a criar sua musica
              </li>
              <li className="flex items-start gap-2">
                <Music className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                Em ate {planoInfo.entrega} voce recebera sua musica pronta
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-900 text-amber-400 font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            Voltar ao inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  // Se expirado
  if (status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Tempo Esgotado
          </h1>
          <p className="text-slate-600 mb-8">
            O tempo para pagamento expirou. Nao se preocupe, voce pode gerar um novo codigo PIX.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-900 text-amber-400 font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar novamente
          </Link>
        </div>
      </div>
    );
  }

  // Tela de pagamento pendente
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">
              <Music className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xl font-bold text-slate-800">Melodia Rara</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Finalize seu pagamento
          </h1>
        </div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-blue-100"
        >
          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-slate-600">Expira em:</span>
            <span className="font-bold text-amber-600 text-lg">{timeLeft}</span>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 inline-block mb-4 shadow-lg">
              {checkoutData.qrCodeBase64 ? (
                <img
                  src={checkoutData.qrCodeBase64}
                  alt="QR Code PIX"
                  className="w-48 h-48 md:w-56 md:h-56"
                />
              ) : (
                <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center bg-blue-50 rounded-xl">
                  <QrCode className="w-20 h-20 text-blue-300" />
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Escaneie o QR Code com o app do seu banco
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400">ou</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Código PIX copia e cola */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              PIX Copia e Cola
            </label>
            <div className="relative">
              <input
                type="text"
                value={checkoutData.pixCopyPaste}
                readOnly
                className="w-full px-4 py-3 pr-24 bg-blue-50 border border-blue-200 rounded-xl text-slate-700 text-sm truncate"
              />
              <button
                onClick={copyPixCode}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-blue-800 to-blue-900 text-amber-400 hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Valor e Plano */}
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-700">{planoInfo.nome}</span>
              </div>
              <span className="text-sm text-slate-500">{planoInfo.melodias} melodia{planoInfo.melodias > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-blue-200">
              <span className="text-slate-600">Valor a pagar:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-slate-500 text-lg">R$</span>
                <span className="text-3xl font-black text-amber-500">{Math.floor(planoInfo.preco)}</span>
                <span className="text-amber-500 text-xl font-bold">,{String(Math.round((planoInfo.preco % 1) * 100)).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Status check */}
          <button
            onClick={checkPaymentStatus}
            disabled={isChecking}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-500/30"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Ja paguei, verificar
              </>
            )}
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Dica:</strong> Apos o pagamento, aguarde alguns segundos para a confirmacao automatica.
              Se preferir, clique no botao acima para verificar manualmente.
            </p>
          </div>
        </motion.div>

        {/* Resumo do pedido */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="font-semibold text-slate-800 mb-4">Resumo do pedido</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Plano:</span>
              <span className="text-slate-800 font-medium">{planoInfo.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Melodias:</span>
              <span className="text-slate-800 font-medium">{planoInfo.melodias}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Entrega:</span>
              <span className="text-slate-800 font-medium">{planoInfo.entrega}</span>
            </div>
            <div className="h-px bg-slate-200 my-2" />
            <div className="flex justify-between">
              <span className="text-slate-500">Musica para:</span>
              <span className="text-slate-800 font-medium">{checkoutData.honoreeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Comprador:</span>
              <span className="text-slate-800 font-medium">{checkoutData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">E-mail:</span>
              <span className="text-slate-800 font-medium">{checkoutData.email}</span>
            </div>
          </div>
        </div>

        {/* Voltar */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
