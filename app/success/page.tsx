'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || searchParams.get('session_id') || '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-lg w-full text-center animate-fadeIn">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <span className="text-[#1a1a1a]">Pagamento Confirmado!</span>
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Obrigado pela sua compra! Sua musica personalizada esta sendo criada com todo carinho.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Numero do Pedido</p>
            <p className="font-mono text-[#1a1a1a] font-semibold">{orderId}</p>
          </div>
        )}

        {/* What happens next */}
        <div className="text-left space-y-4 mb-8">
          <h3 className="font-semibold text-[#1a1a1a]">Proximos passos:</h3>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-[#1a1a1a]">Producao da sua musica</p>
              <p className="text-sm text-gray-500">Nossa equipe ja comecou a criar sua melodia exclusiva</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-[#1a1a1a]">Voce recebe 2 versoes</p>
              <p className="text-sm text-gray-500">Enviaremos 2 melodias diferentes para voce escolher</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-[#1a1a1a]">Entrega em 5 minutos</p>
              <p className="text-sm text-gray-500">Suas musicas ficam disponiveis direto no site e por email</p>
            </div>
          </div>
        </div>

        {/* Delivery time */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border-2 border-[#1a1a1a]">
          <p className="text-[#1a1a1a] font-semibold">
            ⏰ Entrega em 5 minutos direto no site
          </p>
        </div>

        {/* Back to home */}
        <a
          href="/"
          className="btn-primary w-full"
        >
          Voltar ao inicio
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
