'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-lg w-full text-center animate-fadeIn">
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <span className="text-red-400">Pagamento nao concluido</span>
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Ops! Parece que houve um problema com o pagamento. Nao se preocupe, voce pode tentar novamente.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Referencia do Pedido</p>
            <p className="font-mono text-gray-700">{orderId}</p>
          </div>
        )}

        {/* Possible reasons */}
        <div className="text-left space-y-3 mb-8 bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-[#1a1a1a] mb-4">Possiveis motivos:</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Saldo insuficiente no cartao ou conta
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Cartao bloqueado ou vencido
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Dados do cartao incorretos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Pagamento cancelado pelo usuario
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="/"
            className="btn-primary w-full"
          >
            Tentar novamente
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full"></div>
      </div>
    }>
      <FailureContent />
    </Suspense>
  );
}
