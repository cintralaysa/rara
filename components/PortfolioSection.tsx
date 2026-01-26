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
    <section id="portfolio" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Portfólio</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ouça nossas músicas
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Cada música conta uma história única. Ouça alguns exemplos do nosso trabalho.
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {/* Cover */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {item.coverImage && (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}

                    {/* Overlay on hover/playing */}
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                      playingId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {/* Waveform when playing */}
                      {playingId === item.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-end gap-1 h-16">
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1.5 bg-white rounded-full"
                                animate={{
                                  height: [12, 32 + Math.random() * 24, 12],
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

                      {/* Play/Pause button */}
                      <button
                        onClick={() => togglePlay(item)}
                        className={`w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                          playingId === item.id ? 'scale-0' : ''
                        }`}
                      >
                        {playingId === item.id ? (
                          <Pause className="w-6 h-6 text-gray-900" />
                        ) : (
                          <Play className="w-6 h-6 text-gray-900 ml-1" />
                        )}
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                      <motion.div
                        className="h-full bg-white"
                        style={{ width: `${progress[item.id] || 0}%` }}
                      />
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                        {item.categoryLabel}
                      </span>
                    </div>

                    {/* Audio element */}
                    <audio
                      ref={el => { if (el) audioRefs.current[item.id] = el; }}
                      src={item.audioUrl}
                      onTimeUpdate={() => handleTimeUpdate(item.id)}
                      onEnded={() => handleEnded(item.id)}
                      preload="none"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{item.duration}</span>
                      </div>
                      {item.occasion && (
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Heart className="w-4 h-4" />
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
      </div>
    </section>
  );
}
