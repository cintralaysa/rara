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
      // Pausar qualquer outro áudio tocando
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
    <section id="portfolio" className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full border border-amber-300/50 mb-4 sm:mb-6">
            <Music className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <span className="text-amber-700 text-xs sm:text-sm font-semibold">Nosso Portfólio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 sm:mb-6">
            Músicas que já
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 bg-clip-text text-transparent"> emocionaram</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
            Ouça algumas das músicas que criamos para nossos clientes. Cada uma conta uma história única e especial.
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-14 px-2">
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-5 md:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xl shadow-amber-500/20'
                  : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200 hover:border-amber-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portfolio grid - 2x2 layout */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto"
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
                <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100 transition-all duration-300">
                  {/* Cover */}
                  <div className="relative aspect-square bg-gradient-to-br from-amber-100 to-rose-100 overflow-hidden">
                    {/* Cover Image */}
                    {item.coverImage && (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}

                    {/* Overlay gradient for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Animated waveform overlay when playing */}
                    {playingId === item.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="flex items-end gap-1.5 h-20">
                          {[...Array(14)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-2 rounded-full bg-gradient-to-t from-amber-500 via-amber-400 to-rose-400"
                              animate={{
                                height: [20, 50 + Math.random() * 30, 20],
                              }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.04,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Play button */}
                    <button
                      onClick={() => togglePlay(item)}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300"
                    >
                      <div className={`w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 ${
                        playingId === item.id
                          ? 'bg-gradient-to-br from-amber-500 to-rose-500 scale-110 shadow-2xl'
                          : 'bg-white/90 backdrop-blur-sm border-2 border-white/50 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:scale-110'
                      } shadow-xl p-5`}>
                        {playingId === item.id ? (
                          <Pause className="w-7 h-7 text-white" />
                        ) : (
                          <Play className="w-7 h-7 text-amber-600 group-hover:text-white ml-1" />
                        )}
                      </div>
                    </button>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500"
                        style={{ width: `${progress[item.id] || 0}%` }}
                      />
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-xl rounded-full text-xs font-bold text-amber-700 border border-amber-200 shadow-lg">
                        {item.categoryLabel}
                      </span>
                    </div>

                    {/* Audio element (hidden) */}
                    <audio
                      ref={el => { if (el) audioRefs.current[item.id] = el; }}
                      src={item.audioUrl}
                      onTimeUpdate={() => handleTimeUpdate(item.id)}
                      onEnded={() => handleEnded(item.id)}
                      preload="none"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 text-xs sm:text-sm">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                        <span>{item.duration}</span>
                      </div>
                      {item.occasion && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-rose-600 text-xs sm:text-sm font-medium">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-rose-500 text-rose-500" />
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-14 md:mt-20"
        >
          <p className="text-slate-600 mb-6 sm:mb-8 text-base sm:text-lg">
            Quer ter uma música assim para você também?
          </p>
          <a
            href="#criar-musica"
            className="inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-base sm:text-lg font-bold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:-translate-y-1"
          >
            <Music className="w-5 h-5 sm:w-6 sm:h-6" />
            Criar minha música
          </a>
        </motion.div>
      </div>
    </section>
  );
}
