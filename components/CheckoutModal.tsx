'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function CheckoutModal({ isOpen, onClose, children }: CheckoutModalProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-0 sm:p-4 md:p-8"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-2xl sm:my-8"
          >
            {/* Efeito de glow - escondido em mobile */}
            <div className="hidden sm:block absolute -inset-1 bg-gradient-to-r from-gold-500/20 via-gold-600/20 to-gold-500/20 rounded-3xl blur-xl opacity-50" />

            {/* Container principal */}
            <div className="relative bg-white sm:bg-[#1a1a1a] rounded-t-2xl sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-white/10 overflow-hidden min-h-[100vh] sm:min-h-0">
              {/* Header com gradiente */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500" />

              {/* Conteúdo - sem padding extra pois o SimpleBookingForm já tem */}
              <div className="p-0">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
