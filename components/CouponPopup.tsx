'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Check } from 'lucide-react';

export default function CouponPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [couponActivated, setCouponActivated] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    // Limpar cupom antigo se existir
    const existingCoupon = localStorage.getItem('melodia_cupom');
    if (existingCoupon && existingCoupon !== 'RARA10') {
      localStorage.removeItem('melodia_cupom');
    }

    // Verificar se cupom ja foi ativado
    if (existingCoupon === 'RARA10') {
      setCouponActivated(true);
      setShowBadge(true);
      return;
    }

    // Delay maior no mobile (12s) vs desktop (5s)
    const delay = window.innerWidth < 768 ? 12000 : 5000;
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const activateCoupon = () => {
    localStorage.setItem('melodia_cupom', 'RARA10');
    window.dispatchEvent(new Event('storage'));
    setCouponActivated(true);
    setShowPopup(false);
    setShowBadge(true);
  };

  const dismissPopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {/* Popup de Cupom */}
      <AnimatePresence>
        {showPopup && !couponActivated && (
          isMobile ? (
            // Mobile: Banner fixo no bottom (nao bloqueia navegacao)
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-[60] p-3"
            >
              <div className="bg-white rounded-2xl p-4 border-2 border-dark-900 shadow-offset-sm relative">
                <button
                  onClick={dismissPopup}
                  className="absolute top-3 right-3 text-dark-600 hover:text-dark-900"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-dark-900 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-dark-900">Presente pra voce!</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-black text-wine-500 tracking-wider">RARA10</span>
                      <span className="text-xs text-dark-600 font-bold">10% OFF</span>
                    </div>
                  </div>
                  <button
                    onClick={activateCoupon}
                    className="btn-bold px-4 py-2.5 bg-dark-900 text-white text-xs flex-shrink-0"
                  >
                    Ativar
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // Desktop: Modal centralizado (original)
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={dismissPopup}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotate: 3 }}
                transition={{ type: 'spring', damping: 20 }}
                className="relative bg-white rounded-3xl p-8 max-w-sm w-full border-2 border-dark-900 shadow-offset"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={dismissPopup}
                  className="absolute top-4 right-4 text-dark-600 hover:text-dark-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-16 h-16 rounded-2xl bg-dark-900 flex items-center justify-center mx-auto mb-5 border-2 border-dark-900 shadow-offset-sm">
                  <Tag className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-black text-dark-900 text-center mb-2 uppercase tracking-wide">
                  Presente pra voce!
                </h3>
                <p className="text-dark-600 text-center text-sm mb-6 font-medium">
                  Use o cupom abaixo e ganhe 10% de desconto na sua musica personalizada
                </p>

                <div className="bg-soft-100 border-2 border-dashed border-dark-900 rounded-xl p-4 text-center mb-6">
                  <span className="text-3xl font-black text-wine-500 tracking-widest">RARA10</span>
                  <p className="text-dark-600 text-xs mt-1 font-bold">10% de desconto</p>
                </div>

                <button
                  onClick={activateCoupon}
                  className="btn-bold w-full py-4 bg-dark-900 text-white text-lg"
                >
                  <Tag className="w-5 h-5" />
                  Ativar Cupom
                </button>
              </motion.div>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Badge fixo de cupom ativo */}
      <AnimatePresence>
        {showBadge && couponActivated && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed bottom-20 left-4 z-50"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-dark-900 text-white text-xs font-black rounded-full border-2 border-dark-900 shadow-lg uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" />
              RARA10 - 10% OFF
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
