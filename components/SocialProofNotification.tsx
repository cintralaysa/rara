'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, CheckCircle } from 'lucide-react';

const NOMES = [
  'Ana Paula', 'Mariana', 'Carlos Eduardo', 'Fernanda', 'Roberto',
  'Juliana', 'Pedro', 'Camila', 'Lucas', 'Beatriz',
  'Rafael', 'Amanda', 'Thiago', 'Isabela', 'Bruno',
  'Leticia', 'Gabriel', 'Patricia', 'Diego', 'Raquel',
  'Marcos', 'Daniela', 'Felipe', 'Larissa', 'Andre',
  'Vanessa', 'Joao Paulo', 'Aline', 'Ricardo', 'Natalia'
];

const TIPOS_MUSICA = [
  'Musica Romantica',
  'Musica de Homenagem',
  'Musica para Casamento',
  'Musica para Aniversario',
  'Musica para Cha Revelacao',
  'Musica para Formatura',
  'Musica para Dia das Maes',
];

const CIDADES = [
  'Sao Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Fortaleza',
  'Salvador', 'Curitiba', 'Recife', 'Brasilia', 'Porto Alegre',
  'Manaus', 'Goiania', 'Campinas'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomMinutes(): number {
  return Math.floor(Math.random() * 15) + 2;
}

export default function SocialProofNotification() {
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState({
    nome: '',
    tipo: '',
    cidade: '',
    minutos: 0,
  });

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Desativar no mobile e quando usuario prefere menos movimento
    if (isMobile || prefersReduced) return;

    const showNotification = () => {
      setNotification({
        nome: getRandomItem(NOMES),
        tipo: getRandomItem(TIPOS_MUSICA),
        cidade: getRandomItem(CIDADES),
        minutos: getRandomMinutes(),
      });
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    // Desktop: primeiro em 20s, depois a cada 45s
    const firstTimer = setTimeout(showNotification, 20000);

    const interval = setInterval(() => {
      const delay = Math.random() * 15000 + 30000;
      setTimeout(showNotification, delay);
    }, 45000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-4 z-50 max-w-xs"
        >
          <div className="bg-white rounded-2xl border-2 border-dark-900 shadow-offset-sm p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-sage-500 flex items-center justify-center flex-shrink-0 border-2 border-dark-900">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-dark-900 truncate">
                {notification.nome}
              </p>
              <p className="text-xs text-dark-600 leading-snug font-medium">
                encomendou uma{' '}
                <span className="font-black text-wine-500">{notification.tipo}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-dark-600 font-semibold">{notification.cidade}</span>
                <span className="text-[10px] text-dark-600">&bull;</span>
                <span className="text-[10px] text-dark-600 font-semibold">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1 align-middle"></span>
                  {notification.minutos} min atras
                </span>
              </div>
            </div>

            <Music className="w-4 h-4 text-wine-500 flex-shrink-0 mt-1" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
