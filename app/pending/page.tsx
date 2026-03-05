'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-lg w-full text-center animate-fadeIn">
        {/* Pending Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <span className="text-yellow-400">Pagamento Pendente</span>
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Seu pagamento esta sendo processado. Assim que for confirmado, voce recebera um email com os proximos passos.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Numero do Pedido</p>
            <p className="font-mono text-[#1a1a1a] font-semibold">{orderId}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-left space-y-4 mb-8 bg-yellow-50 rounded-xl p-6 border border-yellow-300">
          <h3 className="font-semibold text-yellow-700">Importante:</h3>

          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              Se voce pagou via PIX, aguarde alguns minutos para a confirmacao automatica
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              Se voce pagou via boleto, o prazo de compensacao e de ate 3 dias uteis
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              Voce recebera um email assim que o pagamento for confirmado
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="/"
            className="btn-primary w-full"
          >
            Voltar ao inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full"></div>
      </div>
    }>
      <PendingContent />
    </Suspense>
  );
}
