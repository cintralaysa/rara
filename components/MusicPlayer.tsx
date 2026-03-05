'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Music, SkipBack, SkipForward } from 'lucide-react';

interface Song {
  audioUrl: string;
  title?: string;
}

interface MusicPlayerProps {
  songs: Song[];
  honoreeName?: string;
}

export default function MusicPlayer({ songs, honoreeName }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const currentSong = songs[currentIndex];
  const hasMutiple = songs.length > 1;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoaded = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (currentIndex < songs.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, songs.length]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const prevTrack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const nextTrack = () => {
    if (currentIndex < songs.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <div className="bg-white rounded-2xl border-2 border-dark-900 shadow-offset p-6">
      <audio ref={audioRef} src={currentSong.audioUrl} preload="metadata" />

      {/* Song info */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-wine-500 flex items-center justify-center mx-auto mb-4 border-2 border-dark-900">
          <Music className="w-10 h-10 text-white" />
        </div>
        <h3 className="font-black text-dark-900 text-lg uppercase tracking-wide">
          {currentSong.title || `Musica para ${honoreeName || 'voce'}`}
        </h3>
        {hasMutiple && (
          <p className="text-dark-500 text-sm mt-1 font-bold">
            Faixa {currentIndex + 1} de {songs.length}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div
          className="h-3 bg-soft-200 rounded-full cursor-pointer border border-dark-900 overflow-hidden"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-wine-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-dark-500 mt-1 font-mono font-bold">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {hasMutiple && (
          <button
            onClick={prevTrack}
            disabled={currentIndex === 0}
            className="p-3 rounded-full border-2 border-dark-900 disabled:opacity-30 hover:bg-soft-100 transition-colors"
          >
            <SkipBack className="w-5 h-5 text-dark-900" />
          </button>
        )}

        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-dark-900 flex items-center justify-center border-2 border-dark-900 shadow-offset hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-white" />
          ) : (
            <Play className="w-7 h-7 text-white ml-1" />
          )}
        </button>

        {hasMutiple && (
          <button
            onClick={nextTrack}
            disabled={currentIndex === songs.length - 1}
            className="p-3 rounded-full border-2 border-dark-900 disabled:opacity-30 hover:bg-soft-100 transition-colors"
          >
            <SkipForward className="w-5 h-5 text-dark-900" />
          </button>
        )}
      </div>

      {/* Download buttons */}
      <div className="mt-6 space-y-2">
        {songs.map((song, i) => (
          <a
            key={i}
            href={song.audioUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-soft-100 rounded-xl border-2 border-dark-900 font-bold text-dark-900 hover:bg-soft-200 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            {songs.length > 1 ? `Download Musica ${i + 1}` : 'Download MP3'}
          </a>
        ))}
      </div>
    </div>
  );
}
