'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  honoreeName: string;
  paymentId: string;
  orderId: string;
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
  planoId?: string;
  planoNome?: string;
  planoPreco?: number;
  planoPrecoCents?: number;
  planoMelodias?: number;
  planoEntrega?: string;
  cupom?: string;
}

interface PlanoInfo {
  id: string;
  nome: string;
  melodias: number;
  entrega: string;
  preco: number;
}

export default function CheckoutPixPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [status, setStatus] = useState<'pending' | 'paid' | 'expired' | 'error' | 'loading'>('loading');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [precoOriginal, setPrecoOriginal] = useState(0);
  const [planoInfo, setPlanoInfo] = useState<PlanoInfo>({
    id: 'basico',
    nome: 'Plano Basico',
    melodias: 1,
    entrega: 'em ate 48 horas',
    preco: 39.90
  });

  // Carregar dados do localStorage e criar PIX
  useEffect(() => {
    const createPixPayment = async () => {
      // Se tem pedido novo pendente, limpar dados antigos de checkout
      const hasPendingOrder = localStorage.getItem('pendingOrder');
      if (hasPendingOrder) {
        localStorage.removeItem('checkoutData');
        localStorage.removeItem('planoInfo');
        localStorage.removeItem('cupomAplicado');
      }

      // Verificar se ja tem dados de checkout (de um PIX ja gerado)
      const existingData = localStorage.getItem('checkoutData');
      const existingPlanoData = localStorage.getItem('planoInfo');

      if (existingData) {
        const parsed = JSON.parse(existingData);
        if (parsed.qrCodeBase64 && parsed.paymentId) {
          setCheckoutData(parsed);
          if (existingPlanoData) {
            setPlanoInfo(JSON.parse(existingPlanoData));
          }
          const cupomData = localStorage.getItem('cupomAplicado');
          if (cupomData) {
            const cupomInfo = JSON.parse(cupomData);
            setCupomAplicado(cupomInfo.aplicado);
            setPrecoOriginal(cupomInfo.precoOriginal);
          }
          setStatus('pending');
          return;
        }
        localStorage.removeItem('checkoutData');
        localStorage.removeItem('planoInfo');
        localStorage.removeItem('cupomAplicado');
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
          entrega: pendingOrder.planoEntrega || 'em ate 48 horas',
          preco: pendingOrder.planoPreco || 39.90
        });
      }

      try {
        // Criar cobranca PIX via Mercado Pago
        const response = await fetch('/api/mercadopago/pix', {
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

        // Detectar se cupom foi aplicado
        if (data.cupomAplicado) {
          setCupomAplicado(true);
          setPrecoOriginal(pendingOrder.planoPreco || (pendingOrder.planoPrecoCents || 3990) / 100);
        }

        // Atualizar info do plano com dados da API
        const planoFromApi: PlanoInfo = {
          id: data.plano?.id || pendingOrder.planoId || 'basico',
          nome: data.plano?.nome || pendingOrder.planoNome || 'Plano Basico',
          melodias: data.plano?.melodias || pendingOrder.planoMelodias || 1,
          entrega: data.plano?.entrega || pendingOrder.planoEntrega || 'em ate 48 horas',
          preco: (data.pixData?.value || pendingOrder.planoPrecoCents || 3990) / 100
        };
        setPlanoInfo(planoFromApi);
        localStorage.setItem('planoInfo', JSON.stringify(planoFromApi));

        // Montar dados do checkout
        const checkout: CheckoutData = {
          name: pendingOrder.userName,
          email: pendingOrder.email,
          phone: pendingOrder.whatsapp,
          honoreeName: pendingOrder.honoreeName,
          paymentId: data.paymentId,
          orderId: data.orderId,
          qrCodeBase64: data.pixData?.qrCodeBase64 || '',
          pixCopyPaste: data.pixData?.pixCopiaECola || '',
          expiresAt: data.pixData?.expiresAt || new Date(Date.now() + 3600000).toISOString(),
        };

        // Salvar info do cupom
        if (data.cupomAplicado) {
          localStorage.setItem('cupomAplicado', JSON.stringify({
            aplicado: true,
            precoOriginal: pendingOrder.planoPreco || (pendingOrder.planoPrecoCents || 3990) / 100
          }));
        }

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

  // Verificar status do pagamento via Mercado Pago
  const checkPaymentStatus = useCallback(async () => {
    if (!checkoutData?.paymentId) return;

    setIsChecking(true);
    try {
      const response = await fetch(`/api/mercadopago/pix/status?paymentId=${checkoutData.paymentId}`);
      const data = await response.json();

      if (data.isPaid) {
        setStatus('paid');
        // Redirecionar para pagina de sucesso
        router.push(`/pagamento/sucesso?orderId=${checkoutData.orderId}`);
      } else if (data.isExpired) {
        setStatus('expired');
        localStorage.removeItem('checkoutData');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setIsChecking(false);
    }
  }, [checkoutData?.paymentId, checkoutData?.orderId, router]);

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

  // Copiar codigo PIX
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
      <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-dark-900 flex items-center justify-center mx-auto mb-6 border-2 border-dark-900">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-black text-dark-900 mb-2">Gerando PIX...</h1>
          <p className="text-dark-600 font-medium">
            Aguarde enquanto preparamos seu pagamento
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error' || !checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-dark-900 mb-2">
            {error || 'Sessao expirada'}
          </h1>
          <p className="text-dark-600 mb-6 font-medium">
            Nao foi possivel processar seu pedido.
          </p>
          <Link
            href="/"
            className="btn-bold px-6 py-3 bg-dark-900 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao inicio
          </Link>
        </div>
      </div>
    );
  }

  // Pagamento confirmado - redirect acontece automaticamente
  if (status === 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 border-2 border-dark-900">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-dark-900 mb-2">Pagamento Confirmado!</h1>
          <p className="text-dark-600 font-medium">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se expirado
  if (status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center border-2 border-dark-900 shadow-offset">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 border-2 border-dark-900">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-2xl font-black text-dark-900 mb-4 uppercase">
            Tempo Esgotado
          </h1>
          <p className="text-dark-600 mb-8 font-medium">
            O tempo para pagamento expirou. Nao se preocupe, voce pode gerar um novo codigo PIX.
          </p>

          <Link
            href="/"
            className="btn-bold px-8 py-4 bg-dark-900 text-white text-lg"
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
    <div className="min-h-screen bg-soft-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-dark-900 flex items-center justify-center border-2 border-dark-900">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-dark-900">Melodia Rara</span>
          </div>
          <h1 className="text-2xl font-black text-dark-900 uppercase tracking-wide">
            Finalize seu pagamento
          </h1>
        </div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-dark-900 shadow-offset"
        >
          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-soft-100 rounded-xl border-2 border-dark-900">
            <Clock className="w-5 h-5 text-wine-500" />
            <span className="text-dark-600 font-bold">Expira em:</span>
            <span className="font-black text-wine-500 text-lg">{timeLeft}</span>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="bg-white border-2 border-dark-900 rounded-2xl p-4 inline-block mb-4 shadow-offset-sm">
              {checkoutData.qrCodeBase64 ? (
                <img
                  src={checkoutData.qrCodeBase64}
                  alt="QR Code PIX"
                  className="w-48 h-48 md:w-56 md:h-56"
                />
              ) : (
                <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center bg-soft-100 rounded-xl">
                  <QrCode className="w-20 h-20 text-dark-300" />
                </div>
              )}
            </div>
            <p className="text-sm text-dark-600 font-medium">
              Escaneie o QR Code com o app do seu banco
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-200" />
            <span className="text-sm text-dark-500 font-bold">ou</span>
            <div className="flex-1 h-px bg-dark-200" />
          </div>

          {/* Codigo PIX copia e cola */}
          <div className="mb-6">
            <label className="block text-sm font-black text-dark-900 mb-2">
              PIX Copia e Cola
            </label>
            <div className="relative">
              <input
                type="text"
                value={checkoutData.pixCopyPaste}
                readOnly
                className="w-full px-4 py-3 pr-24 bg-soft-100 border-2 border-dark-900 rounded-xl text-dark-700 text-sm truncate"
              />
              <button
                onClick={copyPixCode}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-black text-sm transition-all duration-200 flex items-center gap-2 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-dark-900 text-white hover:bg-dark-700'
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
          <div className="bg-soft-100 rounded-2xl p-4 mb-6 border-2 border-dark-900">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-wine-500" />
                <span className="font-black text-dark-900">{planoInfo.nome}</span>
              </div>
              <span className="text-sm text-dark-600 font-bold">{planoInfo.melodias} melodia{planoInfo.melodias > 1 ? 's' : ''}</span>
            </div>
            {cupomAplicado && (
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-black text-green-600 bg-green-100 px-2.5 py-1 rounded-full border border-green-300 uppercase tracking-wider">RARA10 -10%</span>
                <span className="text-sm text-dark-400 line-through">R$ {precoOriginal.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t-2 border-dark-900">
              <span className="text-dark-600 font-bold">Valor a pagar:</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-bold ${cupomAplicado ? 'text-green-600' : 'text-dark-600'}`}>R$</span>
                <span className={`text-3xl font-black ${cupomAplicado ? 'text-green-600' : 'text-wine-500'}`}>{Math.floor(planoInfo.preco)}</span>
                <span className={`text-xl font-black ${cupomAplicado ? 'text-green-600' : 'text-wine-500'}`}>,{String(Math.round((planoInfo.preco % 1) * 100)).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Status check */}
          <button
            onClick={checkPaymentStatus}
            disabled={isChecking}
            className="btn-bold w-full py-4 bg-green-500 text-white text-lg border-dark-900 hover:bg-green-600 disabled:opacity-50"
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
          <div className="mt-6 p-4 bg-soft-100 rounded-xl border-2 border-dark-900">
            <p className="text-sm text-dark-600 font-medium">
              <strong>Dica:</strong> Apos o pagamento, aguarde alguns segundos para a confirmacao automatica.
              Se preferir, clique no botao acima para verificar manualmente.
            </p>
          </div>
        </motion.div>

        {/* Resumo do pedido */}
        <div className="mt-6 bg-white rounded-2xl p-6 border-2 border-dark-900 shadow-offset-sm">
          <h3 className="font-black text-dark-900 mb-4 uppercase tracking-wide">Resumo do pedido</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-600 font-medium">Plano:</span>
              <span className="text-dark-900 font-bold">{planoInfo.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-600 font-medium">Melodias:</span>
              <span className="text-dark-900 font-bold">{planoInfo.melodias}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-600 font-medium">Entrega:</span>
              <span className="text-dark-900 font-bold">{planoInfo.entrega}</span>
            </div>
            <div className="h-px bg-dark-200 my-2" />
            <div className="flex justify-between">
              <span className="text-dark-600 font-medium">Musica para:</span>
              <span className="text-dark-900 font-bold">{checkoutData.honoreeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-600 font-medium">Comprador:</span>
              <span className="text-dark-900 font-bold">{checkoutData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-600 font-medium">E-mail:</span>
              <span className="text-dark-900 font-bold">{checkoutData.email}</span>
            </div>
          </div>
        </div>

        {/* Voltar */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-dark-600 hover:text-dark-900 transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
