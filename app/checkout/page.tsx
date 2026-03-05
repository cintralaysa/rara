'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  QrCode,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { trackAddPaymentInfo } from '@/components/MetaPixel';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    MercadoPago: any;
  }
}

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

type PaymentMethod = 'pix' | 'card';

export default function CheckoutPage() {
  const router = useRouter();
  const brickContainerRef = useRef<HTMLDivElement>(null);
  const brickControllerRef = useRef<any>(null);

  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [status, setStatus] = useState<'idle' | 'loading' | 'pending' | 'paid' | 'expired' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  // PIX state
  const [pixData, setPixData] = useState<CheckoutData | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // Card state
  const [bricksReady, setBricksReady] = useState(false);
  const [cardProcessing, setCardProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Shared
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [precoOriginal, setPrecoOriginal] = useState(0);
  const [planoInfo, setPlanoInfo] = useState<PlanoInfo>({
    id: 'basico',
    nome: 'Plano Basico',
    melodias: 1,
    entrega: 'em ate 48 horas',
    preco: 39.90,
  });

  // Load pending order from localStorage
  useEffect(() => {
    const data = localStorage.getItem('pendingOrder');
    if (!data) {
      setError('Dados do pedido nao encontrados');
      setStatus('error');
      return;
    }

    const order: PendingOrder = JSON.parse(data);
    setPendingOrder(order);

    if (order.planoId) {
      setPlanoInfo({
        id: order.planoId,
        nome: order.planoNome || 'Plano Basico',
        melodias: order.planoMelodias || 1,
        entrega: order.planoEntrega || 'em ate 48 horas',
        preco: order.planoPreco || 39.90,
      });
    }

    setStatus('idle');
  }, []);

  // Create PIX when method is selected or on initial load
  useEffect(() => {
    if (paymentMethod !== 'pix' || !pendingOrder || pixData) return;

    const createPix = async () => {
      setStatus('loading');
      try {
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

        if (data.cupomAplicado) {
          setCupomAplicado(true);
          setPrecoOriginal(pendingOrder.planoPreco || (pendingOrder.planoPrecoCents || 3990) / 100);
        }

        const planoFromApi: PlanoInfo = {
          id: data.plano?.id || pendingOrder.planoId || 'basico',
          nome: data.plano?.nome || pendingOrder.planoNome || 'Plano Basico',
          melodias: data.plano?.melodias || pendingOrder.planoMelodias || 1,
          entrega: data.plano?.entrega || pendingOrder.planoEntrega || 'em ate 48 horas',
          preco: (data.pixData?.value || pendingOrder.planoPrecoCents || 3990) / 100,
        };
        setPlanoInfo(planoFromApi);

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

        // Save for success page
        localStorage.setItem('checkoutData', JSON.stringify(checkout));
        localStorage.setItem('planoInfo', JSON.stringify(planoFromApi));
        if (data.cupomAplicado) {
          localStorage.setItem('cupomAplicado', JSON.stringify({
            aplicado: true,
            precoOriginal: pendingOrder.planoPreco || (pendingOrder.planoPrecoCents || 3990) / 100,
          }));
        }

        setPixData(checkout);
        setStatus('pending');
      } catch {
        setError('Erro de conexao. Tente novamente.');
        setStatus('error');
      }
    };

    createPix();
  }, [paymentMethod, pendingOrder, pixData]);

  // Load Mercado Pago Bricks SDK for card payment
  useEffect(() => {
    if (paymentMethod !== 'card' || !pendingOrder) return;

    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (!publicKey) {
      setCardError('Chave publica do Mercado Pago nao configurada');
      return;
    }

    // Check if SDK already loaded
    if (window.MercadoPago) {
      initBricks(publicKey);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => initBricks(publicKey);
    script.onerror = () => setCardError('Erro ao carregar SDK de pagamento');
    document.body.appendChild(script);

    return () => {
      if (brickControllerRef.current) {
        brickControllerRef.current.unmount?.();
        brickControllerRef.current = null;
      }
    };
  }, [paymentMethod, pendingOrder]);

  const initBricks = async (publicKey: string) => {
    if (!brickContainerRef.current || !pendingOrder) return;

    try {
      // Unmount previous brick if exists
      if (brickControllerRef.current) {
        brickControllerRef.current.unmount?.();
      }

      const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' });
      const bricksBuilder = mp.bricks();

      // Calculate amount
      const planoId = pendingOrder.planoId || 'basico';
      const baseCents = planoId === 'premium' ? 7990 : 3990;
      const cupom = (pendingOrder.cupom || '').toUpperCase();
      const hasCupom = cupom === 'RARA10';
      const finalCents = hasCupom ? Math.round(baseCents * 0.9) : baseCents;
      const amount = finalCents / 100;

      brickControllerRef.current = await bricksBuilder.create(
        'cardPayment',
        'cardPaymentBrick_container',
        {
          initialization: {
            amount,
          },
          customization: {
            visual: {
              style: {
                theme: 'default',
                customVariables: {
                  formBackgroundColor: '#FEFCFD',
                  baseColor: '#837AB6',
                },
              },
            },
            paymentMethods: {
              maxInstallments: 6,
            },
          },
          callbacks: {
            onReady: () => {
              setBricksReady(true);
            },
            onSubmit: async (cardFormData: any) => {
              setCardProcessing(true);
              setCardError(null);

              try {
                const response = await fetch('/api/mercadopago/process', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    cardData: cardFormData,
                    orderData: pendingOrder,
                  }),
                });

                const data = await response.json();

                if (data.success && (data.status === 'approved' || data.status === 'pending')) {
                  // Save for success page
                  localStorage.setItem('checkoutData', JSON.stringify({
                    name: pendingOrder.userName,
                    email: pendingOrder.email,
                    honoreeName: pendingOrder.honoreeName,
                    orderId: data.orderId,
                  }));
                  localStorage.removeItem('pendingOrder');
                  router.push(`/pagamento/sucesso?orderId=${data.orderId}`);
                } else {
                  setCardError(data.error || 'Pagamento recusado. Tente outro cartao ou PIX.');
                }
              } catch {
                setCardError('Erro de conexao. Tente novamente.');
              } finally {
                setCardProcessing(false);
              }
            },
            onError: (error: any) => {
              console.error('Bricks error:', error);
              setCardError('Erro no formulario de pagamento');
            },
          },
        }
      );
    } catch (err) {
      console.error('Error initializing Bricks:', err);
      setCardError('Erro ao inicializar formulario de pagamento');
    }
  };

  // Poll PIX status
  const checkPaymentStatus = useCallback(async () => {
    if (!pixData?.paymentId) return;

    setIsChecking(true);
    try {
      const response = await fetch(`/api/mercadopago/pix/status?paymentId=${pixData.paymentId}`);
      const data = await response.json();

      if (data.isPaid) {
        setStatus('paid');
        localStorage.removeItem('pendingOrder');
        router.push(`/pagamento/sucesso?orderId=${pixData.orderId}`);
      } else if (data.isExpired) {
        setStatus('expired');
        localStorage.removeItem('checkoutData');
      }
    } catch {
      // Silent fail on polling
    } finally {
      setIsChecking(false);
    }
  }, [pixData?.paymentId, pixData?.orderId, router]);

  // Polling interval
  useEffect(() => {
    if (status !== 'pending' || paymentMethod !== 'pix' || !pixData) return;
    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [status, paymentMethod, pixData, checkPaymentStatus]);

  // Countdown timer
  useEffect(() => {
    if (!pixData?.expiresAt || status !== 'pending') return;
    const updateTimer = () => {
      const diff = new Date(pixData.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setStatus('expired');
        setTimeLeft('Expirado');
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [pixData?.expiresAt, status]);

  const copyPixCode = async () => {
    if (!pixData?.pixCopyPaste) return;
    try {
      await navigator.clipboard.writeText(pixData.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch { /* ignore */ }
  };

  const switchMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setCardError(null);
    trackAddPaymentInfo(method);
  };

  // Loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-dark-900 flex items-center justify-center mx-auto mb-6 border-2 border-dark-900">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-black text-dark-900 mb-2">Preparando pagamento...</h1>
          <p className="text-dark-600 font-medium">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Error
  if (status === 'error' && !pendingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-dark-900 mb-2">{error || 'Sessao expirada'}</h1>
          <p className="text-dark-600 mb-6 font-medium">Nao foi possivel processar seu pedido.</p>
          <Link href="/" className="btn-bold px-6 py-3 bg-dark-900 text-white">
            <ArrowLeft className="w-5 h-5" />
            Voltar ao inicio
          </Link>
        </div>
      </div>
    );
  }

  // Paid (redirect happening)
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

  // Expired
  if (status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-100 p-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center border-2 border-dark-900 shadow-offset">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 border-2 border-dark-900">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-dark-900 mb-4 uppercase">Tempo Esgotado</h1>
          <p className="text-dark-600 mb-8 font-medium">O tempo para pagamento expirou.</p>
          <Link href="/" className="btn-bold px-8 py-4 bg-dark-900 text-white text-lg">
            <RefreshCw className="w-5 h-5" />
            Tentar novamente
          </Link>
        </div>
      </div>
    );
  }

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

        {/* Payment Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => switchMethod('pix')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm border-2 transition-all ${
              paymentMethod === 'pix'
                ? 'bg-dark-900 text-white border-dark-900 shadow-offset-sm'
                : 'bg-white text-dark-600 border-dark-300 hover:border-dark-900'
            }`}
          >
            <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current"><path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.172 33.045 21.98 53.12 21.98h15.098l-97.138 97.139c-30.326 30.344-79.505 30.344-109.85 0l-97.415-97.416h9.232zm280.068-271.294c-20.056 0-38.929 7.809-53.12 22l-76.97 76.99c-5.551 5.53-14.6 5.568-20.15-.02l-76.711-76.693c-14.192-14.191-33.046-21.999-53.12-21.999h-9.234l97.416-97.416c30.344-30.344 79.523-30.344 109.867 0l97.138 97.138h-15.116z"/></svg>
            PIX
          </button>
          <button
            onClick={() => switchMethod('card')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm border-2 transition-all ${
              paymentMethod === 'card'
                ? 'bg-dark-900 text-white border-dark-900 shadow-offset-sm'
                : 'bg-white text-dark-600 border-dark-300 hover:border-dark-900'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            Cartao
          </button>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-dark-900 shadow-offset"
        >
          {/* PIX Payment */}
          {paymentMethod === 'pix' && (
            <>
              {pixData ? (
                <>
                  {/* Timer */}
                  <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-soft-100 rounded-xl border-2 border-dark-900">
                    <Clock className="w-5 h-5 text-wine-500" />
                    <span className="text-dark-600 font-bold">Expira em:</span>
                    <span className="font-black text-wine-500 text-lg">{timeLeft}</span>
                  </div>

                  {/* QR Code */}
                  <div className="text-center mb-6">
                    <div className="bg-white border-2 border-dark-900 rounded-2xl p-4 inline-block mb-4 shadow-offset-sm">
                      {pixData.qrCodeBase64 ? (
                        <img src={pixData.qrCodeBase64} alt="QR Code PIX" className="w-48 h-48 md:w-56 md:h-56" />
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

                  {/* PIX Copy */}
                  <div className="mb-6">
                    <label className="block text-sm font-black text-dark-900 mb-2">PIX Copia e Cola</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={pixData.pixCopyPaste}
                        readOnly
                        className="w-full px-4 py-3 pr-24 bg-soft-100 border-2 border-dark-900 rounded-xl text-dark-700 text-sm truncate"
                      />
                      <button
                        onClick={copyPixCode}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-black text-sm transition-all flex items-center gap-2 ${
                          copied ? 'bg-green-500 text-white' : 'bg-dark-900 text-white hover:bg-dark-700'
                        }`}
                      >
                        {copied ? <><CheckCircle className="w-4 h-4" />Copiado</> : <><Copy className="w-4 h-4" />Copiar</>}
                      </button>
                    </div>
                  </div>

                  {/* Verify button */}
                  <button
                    onClick={checkPaymentStatus}
                    disabled={isChecking}
                    className="btn-bold w-full py-4 bg-green-500 text-white text-lg border-dark-900 hover:bg-green-600 disabled:opacity-50"
                  >
                    {isChecking ? (
                      <><Loader2 className="w-5 h-5 animate-spin" />Verificando...</>
                    ) : (
                      <><RefreshCw className="w-5 h-5" />Ja paguei, verificar</>
                    )}
                  </button>
                </>
              ) : status === 'error' ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-dark-600 font-medium">{error}</p>
                  <button
                    onClick={() => { setError(null); setStatus('idle'); setPixData(null); }}
                    className="btn-bold px-6 py-3 bg-dark-900 text-white mt-4"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Tentar novamente
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 text-dark-900 animate-spin mx-auto mb-3" />
                  <p className="text-dark-600 font-medium">Gerando QR Code PIX...</p>
                </div>
              )}
            </>
          )}

          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <>
              {cardProcessing && (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 text-dark-900 animate-spin mx-auto mb-3" />
                  <p className="text-dark-900 font-black">Processando pagamento...</p>
                  <p className="text-dark-600 text-sm font-medium mt-1">Nao feche esta pagina</p>
                </div>
              )}

              {cardError && (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 text-sm font-medium mb-4">
                  {cardError}
                </div>
              )}

              <div
                ref={brickContainerRef}
                id="cardPaymentBrick_container"
                className={cardProcessing ? 'hidden' : ''}
              />

              {!bricksReady && !cardError && !cardProcessing && (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 text-dark-900 animate-spin mx-auto mb-3" />
                  <p className="text-dark-600 font-medium">Carregando formulario de cartao...</p>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Valor e Plano */}
        <div className="mt-6 bg-white rounded-2xl p-4 border-2 border-dark-900 shadow-offset-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-wine-500" />
              <span className="font-black text-dark-900">{planoInfo.nome}</span>
            </div>
            <span className="text-sm text-dark-600 font-bold">
              {planoInfo.melodias} melodia{planoInfo.melodias > 1 ? 's' : ''}
            </span>
          </div>
          {cupomAplicado && (
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-black text-green-600 bg-green-100 px-2.5 py-1 rounded-full border border-green-300 uppercase tracking-wider">
                RARA10 -10%
              </span>
              <span className="text-sm text-dark-400 line-through">
                R$ {precoOriginal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t-2 border-dark-900">
            <span className="text-dark-600 font-bold">Valor a pagar:</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold ${cupomAplicado ? 'text-green-600' : 'text-dark-600'}`}>R$</span>
              <span className={`text-3xl font-black ${cupomAplicado ? 'text-green-600' : 'text-wine-500'}`}>
                {Math.floor(planoInfo.preco)}
              </span>
              <span className={`text-xl font-black ${cupomAplicado ? 'text-green-600' : 'text-wine-500'}`}>
                ,{String(Math.round((planoInfo.preco % 1) * 100)).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-4 bg-white rounded-2xl p-4 border-2 border-dark-900">
          <h3 className="font-black text-dark-900 mb-3 uppercase tracking-wide text-sm">Resumo</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-600">Musica para:</span>
              <span className="text-dark-900 font-bold">{pendingOrder?.honoreeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-600">Comprador:</span>
              <span className="text-dark-900 font-bold">{pendingOrder?.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-600">Entrega:</span>
              <span className="text-dark-900 font-bold">{planoInfo.entrega}</span>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-dark-600 hover:text-dark-900 transition-colors font-bold">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
