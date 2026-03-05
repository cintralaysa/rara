'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, Clock, Heart } from 'lucide-react';
import { PORTFOLIO_ITEMS, PORTFOLIO_CATEGORIES, type PortfolioItem } from '@/lib/portfolio';
import Image from 'next/image';

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const filteredItems = activeCategory === 'all'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter(item => item.category === activeCategory);

  const togglePlay = (item: PortfolioItem) => {
    const audio = audioRefs.current[item.id];
    if (playingId === item.id) {
      audio?.pause();
      setPlayingId(null);
    } else {
      Object.values(audioRefs.current).forEach(a => a?.pause());
      audio?.play();
      setPlayingId(item.id);
    }
  };

  const handleTimeUpdate = (id: string) => {
    const audio = audioRefs.current[id];
    if (audio) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      setProgress(prev => ({ ...prev, [id]: progressPercent }));
    }
  };

  const handleEnded = (id: string) => {
    setPlayingId(null);
    setProgress(prev => ({ ...prev, [id]: 0 }));
  };

  return (
    <section id="portfolio" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border-2 border-dark-900 shadow-offset-sm mb-6">
            <Music className="w-4 h-4 text-wine-500" />
            <span className="text-dark-900 text-xs sm:text-sm font-black uppercase tracking-widest">Nosso Portfólio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-dark-900 mb-4 tracking-tight">
            Músicas que já{' '}
            <span className="text-wine-500">emocionaram</span>
          </h2>
          <p className="text-dark-600 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Ouça algumas das músicas que criamos. Cada uma conta uma história única.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2">
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-black text-sm transition-all duration-300 uppercase tracking-wide border-2 ${
                activeCategory === cat.id
                  ? 'bg-dark-900 text-white border-dark-900 shadow-offset-sm'
                  : 'bg-white text-dark-900 border-dark-900/20 hover:border-dark-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7 max-w-4xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-white border-2 border-dark-900 rounded-2xl overflow-hidden card-hover shadow-offset-sm">
                  <div className="relative aspect-square overflow-hidden">
                    {item.coverImage && (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />

                    {playingId === item.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="flex items-end gap-1.5 h-20">
                          {[...Array(14)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-2.5 rounded-full bg-wine-400"
                              animate={{ height: [20, 50 + Math.random() * 30, 20] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.04 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => togglePlay(item)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-dark-900 ${
                        playingId === item.id
                          ? 'bg-dark-900 scale-110'
                          : 'bg-white group-hover:bg-dark-900 group-hover:scale-110'
                      } shadow-offset-sm`}>
                        {playingId === item.id ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-dark-900 group-hover:text-white ml-0.5" />
                        )}
                      </div>
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                      <motion.div
                        className="h-full bg-wine-500"
                        style={{ width: `${progress[item.id] || 0}%` }}
                      />
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 bg-white rounded-full text-[10px] font-black text-dark-900 uppercase tracking-wider border-2 border-dark-900 shadow-sm">
                        {item.categoryLabel}
                      </span>
                    </div>

                    <audio
                      ref={el => { if (el) audioRefs.current[item.id] = el; }}
                      src={item.audioUrl}
                      onTimeUpdate={() => handleTimeUpdate(item.id)}
                      onEnded={() => handleEnded(item.id)}
                      preload="none"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="font-black text-dark-900 text-base mb-1.5 line-clamp-1">{item.title}</h3>
                    <p className="text-dark-600 text-xs sm:text-sm mb-3 line-clamp-1 font-medium">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-dark-600 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-dark-900" />
                        <span>{item.duration}</span>
                      </div>
                      {item.occasion && (
                        <div className="flex items-center gap-1.5 text-wine-500 text-xs font-black">
                          <Heart className="w-3.5 h-3.5 fill-wine-500 text-wine-500" />
                          <span>{item.occasion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-14"
        >
          <p className="text-dark-600 mb-6 text-base sm:text-lg font-bold">
            Quer ter uma música assim para você também?
          </p>
          <a
            href="#criar-musica"
            className="btn-bold px-8 sm:px-12 py-4 sm:py-5 bg-dark-900 text-white text-base sm:text-lg inline-flex"
          >
            <Music className="w-5 h-5" />
            Criar minha música
          </a>
        </motion.div>
      </div>
    </section>
  );
}
