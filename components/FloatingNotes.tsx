'use client';

import { useEffect, useState } from 'react';

const NOTES = ['♪', '♫', '♬', '♩', '𝄞'];

// Cores mais suaves para mobile
const COLORS_MOBILE = [
  'rgba(131, 122, 182, 0.30)',
  'rgba(204, 141, 179, 0.30)',
  'rgba(246, 165, 192, 0.35)',
  'rgba(247, 194, 202, 0.30)',
  'rgba(184, 107, 154, 0.30)',
  'rgba(107, 94, 158, 0.25)',
];

// Cores normais para desktop
const COLORS_DESKTOP = [
  'rgba(131, 122, 182, 0.50)',
  'rgba(157, 133, 182, 0.45)',
  'rgba(204, 141, 179, 0.50)',
  'rgba(246, 165, 192, 0.55)',
  'rgba(247, 194, 202, 0.45)',
  'rgba(37, 14, 44, 0.15)',
  'rgba(184, 107, 154, 0.45)',
  'rgba(107, 94, 158, 0.40)',
];

// Posicoes organizadas para mobile (distribuidas uniformemente)
const MOBILE_POSITIONS = ['10%', '25%', '40%', '55%', '70%', '85%'];

interface NoteItem {
  id: number;
  note: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export default function FloatingNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setNotes([]);
      return;
    }

    if (isMobile) {
      // Mobile: 6 notas organizadas, menores, mais suaves e lentas
      const generated: NoteItem[] = MOBILE_POSITIONS.map((pos, i) => ({
        id: i,
        note: NOTES[i % NOTES.length],
        left: pos,
        size: Math.random() * 10 + 14, // 14-24px (menor)
        duration: Math.random() * 15 + 35, // 35-50s (mais lento, sereno)
        delay: i * 4, // Escalonado uniformemente (0, 4, 8, 12, 16, 20)
        color: COLORS_MOBILE[i % COLORS_MOBILE.length],
      }));
      setNotes(generated);
    } else {
      // Desktop: 12 notas com posicoes random
      const generated: NoteItem[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        note: NOTES[Math.floor(Math.random() * NOTES.length)],
        left: `${5 + Math.random() * 90}%`,
        size: Math.random() * 20 + 18,
        duration: Math.random() * 20 + 28,
        delay: Math.random() * 24,
        color: COLORS_DESKTOP[Math.floor(Math.random() * COLORS_DESKTOP.length)],
      }));
      setNotes(generated);
    }
  }, []);

  if (notes.length === 0) return null;

  return (
    <div className="fixed pointer-events-none overflow-hidden z-0" style={{ top: '80px', left: 0, right: 0, bottom: 0 }}>
      {notes.map((n) => (
        <span
          key={n.id}
          className="floating-note"
          style={{
            left: n.left,
            fontSize: `${n.size}px`,
            animationDuration: `${n.duration}s`,
            animationDelay: `${n.delay}s`,
            color: n.color,
          }}
        >
          {n.note}
        </span>
      ))}
    </div>
  );
}
