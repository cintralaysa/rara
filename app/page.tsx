'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Play,
  Pause,
  Heart,
  Star,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Instagram,
  Youtube,
  Mail,
  Clock,
  CheckCircle,
  Sparkles,
  Gift,
  Mic2,
  Headphones,
  Volume2,
  ArrowRight,
  Quote,
  Send,
  Wand2,
  Edit3,
  Crown,
  Check,
  Shield,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import { TESTIMONIALS, FAQS, COMPANY_INFO, PLANOS } from '@/lib/data';
import CheckoutModal from '@/components/CheckoutModal';
import SimpleBookingForm from '@/components/SimpleBookingForm';
import PortfolioSection from '@/components/PortfolioSection';
import SocialProofNotification from '@/components/SocialProofNotification';
import FloatingNotes from '@/components/FloatingNotes';

// Logo SVG - Bold e com presença
function LogoSVG({ className = "h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="24" r="20" fill="#F6A5C0" opacity="0.5"/>
      <circle cx="22" cy="24" r="15" fill="#CC8DB3" opacity="0.3"/>
      <path d="M28 12v18c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c1.1 0 2.1.3 3 .8V12l3-2v2z" fill="#250e2c"/>
      <path d="M25 12l6-3v6l-6 3V12z" fill="#837AB6"/>
      <text x="50" y="20" fontFamily="'Georgia', serif" fontWeight="900" fontSize="21" fill="#250e2c" letterSpacing="1">
        Melodia
      </text>
      <text x="155" y="20" fontFamily="'Georgia', serif" fontWeight="900" fontSize="21" fill="#B86B9A" letterSpacing="1">
        Rara
      </text>
      <text x="50" y="38" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="8" fill="#250e2c" letterSpacing="3.5">
        MÚSICAS PERSONALIZADAS
      </text>
      <line x1="50" y1="26" x2="200" y2="26" stroke="#250e2c" strokeWidth="1.5" opacity="0.15"/>
    </svg>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<string>('basico');
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);

  const heroAudioRef = useRef<HTMLAudioElement>(null);

  const openModalWithPlan = (planId: string) => {
    setSelectedPlan(planId);
    setIsModalOpen(true);
  };

  const toggleHeroAudio = () => {
    if (heroAudioRef.current) {
      if (isHeroPlaying) {
        heroAudioRef.current.pause();
      } else {
        heroAudioRef.current.play();
      }
      setIsHeroPlaying(!isHeroPlaying);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const audio = heroAudioRef.current;
    if (audio) {
      const handleEnded = () => setIsHeroPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);


  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-soft-50 relative">
      <FloatingNotes />

      {/* Ambient blobs - hidden on mobile for GPU performance */}
      <div className="hidden md:block">
        <div className="fixed top-[-200px] right-[-200px] w-[600px] h-[600px] bg-soft-200/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-gold-200/25 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* ===== HEADER ===== */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white md:bg-white/95 md:backdrop-blur-xl border-b-2 border-dark-900 shadow-sm'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            <LogoSVG className="h-10 sm:h-12 w-auto" />

            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Planos', id: 'planos' },
                { label: 'Portfólio', id: 'portfolio' },
                { label: 'Como Funciona', id: 'como-funciona' },
                { label: 'Depoimentos', id: 'depoimentos' },
                { label: 'Dúvidas', id: 'faq' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-dark-900 hover:text-wine-500 transition-all duration-300 font-bold text-sm uppercase tracking-wide relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-dark-900 rounded-full transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-bold px-5 sm:px-7 py-2.5 sm:py-3 bg-dark-900 text-white text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Criar Música</span>
              <span className="sm:hidden">Criar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-[18%] left-[6%] text-wine-400 text-2xl md:text-4xl animate-float opacity-40 md:opacity-60">{'♪'}</span>
          <span className="absolute top-[28%] right-[10%] text-gold-500 text-xl md:text-3xl animate-float opacity-35 md:opacity-50" style={{ animationDelay: '1s' }}>{'♫'}</span>
          <span className="hidden md:block absolute bottom-[25%] left-[12%] text-wine-300 text-5xl animate-float opacity-45" style={{ animationDelay: '2s' }}>{'♬'}</span>
          <span className="hidden md:block absolute top-[45%] right-[6%] text-gold-400 text-4xl animate-float opacity-45" style={{ animationDelay: '0.5s' }}>{'𝄞'}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border-2 border-dark-900 shadow-offset-sm mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-sage-400 animate-pulse" />
                <span className="text-dark-900 text-xs sm:text-sm font-black uppercase tracking-wide">+5.502 músicas criadas</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-dark-900 leading-[1.05] mb-6 sm:mb-8 tracking-tight">
                Fazemos sua emoção virar{' '}
                <span className="relative inline-block">
                  <span className="text-wine-500">melodia</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8c50-8 100-8 196 0" stroke="#837AB6" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                </span>
                {' '}em apenas{' '}
                <br className="hidden sm:block" />
                <span className="text-wine-500">5 minutos</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-dark-700 mb-8 sm:mb-10 leading-relaxed max-w-xl font-medium">
                Sua emoção merece uma melodia única.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-14">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-bold px-8 sm:px-10 py-4 sm:py-5 bg-dark-900 text-white text-base sm:text-lg"
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  Criar Minha Música
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="btn-bold px-8 sm:px-10 py-4 sm:py-5 bg-white text-dark-900 text-base sm:text-lg"
                >
                  <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-wine-500" />
                  Ouvir Exemplos
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-5">
                {[
                  { icon: <Users className="w-4 h-4 text-dark-900" />, value: '+5.502', label: 'Músicas criadas' },
                  { icon: <Star className="w-4 h-4 text-wine-400 fill-wine-400" />, value: '4.9', label: 'Avaliação' },
                  { icon: <Clock className="w-4 h-4 text-gold-600" />, value: 'Rápida', label: 'Entrega' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border-2 border-dark-900 shadow-offset-sm">
                    <div className="w-9 h-9 rounded-xl bg-soft-200 flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-lg font-black text-dark-900 leading-none">{stat.value}</p>
                      <p className="text-dark-600 text-[11px] font-semibold">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative max-w-md mx-auto">
                <motion.div
                  className="absolute -top-4 -right-4 z-20"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="bg-dark-900 text-white text-sm font-black px-6 py-3 rounded-full border-2 border-dark-900 shadow-offset-sm uppercase tracking-wide">
                    A partir de <span className="text-wine-300 underline decoration-wine-400 decoration-2 underline-offset-2">R$ 59,90</span>
                  </div>
                </motion.div>

                <div className="bg-white rounded-3xl p-6 relative overflow-hidden border-2 border-dark-900 shadow-offset">
                  {/* Foto */}
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative border-2 border-dark-900">
                    <Image
                      src="/images/cha-bebe-hero.png"
                      alt="Música Personalizada para qualquer ocasião"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-4 py-2 bg-dark-900 text-white rounded-full text-xs font-black uppercase tracking-wide shadow-md">
                        Chá de Bebê
                      </span>
                    </div>
                  </div>

                  <audio ref={heroAudioRef} src="/audio/sample-cha-bebe.mp3" preload="none" />

                  <h3 className="text-lg font-black text-dark-900 mb-1">Chá Revelação</h3>
                  <p className="text-sm text-dark-600 mb-4 font-medium">De um amor verdadeiro nasceu a canção</p>

                  {/* Waveform visual */}
                  <div className="flex items-center justify-center gap-[2px] mb-4 h-8">
                    {[...Array(32)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-[3px] rounded-full"
                        style={{
                          background: i < 16 ? '#CC8DB3' : '#837AB6',
                          height: isHeroPlaying ? undefined : `${6 + Math.sin(i * 0.5) * 12}px`
                        }}
                        animate={isHeroPlaying ? { height: [4, 14 + Math.random() * 20, 4] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.03 }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={toggleHeroAudio}
                    className="btn-bold w-full py-3.5 bg-dark-900 text-white text-sm"
                  >
                    {isHeroPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                    {isHeroPlaying ? 'Pausar' : 'Ouvir Música'}
                  </button>

                  {/* Destaque: qualquer ocasião */}
                  <div className="mt-4 pt-4 border-t-2 border-dark-900/10">
                    <p className="text-center text-xs text-dark-900 font-black mb-2.5 uppercase tracking-wider">Para qualquer ocasião:</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {['Casamento', 'Aniversário', 'Chá de Bebê', 'Dia das Mães', 'Formatura', 'Homenagem'].map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-soft-100 text-dark-900 text-[10px] font-black rounded-full border-2 border-dark-900/20 uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge decorativo */}
                <motion.div
                  className="absolute -bottom-4 -left-6 z-20"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="bg-dark-900 text-wine-300 text-xs font-black px-4 py-2 rounded-full border-2 border-dark-900 shadow-offset-sm flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-wine-300 text-wine-300" />
                    4.9 ★ Avaliação
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-dark-900" />
        </motion.div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="py-6 border-y-2 border-dark-900 bg-dark-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {[
              { icon: <Shield className="w-5 h-5" />, text: 'Pagamento 100% Seguro' },
              { icon: <Award className="w-5 h-5" />, text: 'Garantia de Satisfação' },
              { icon: <CheckCircle className="w-5 h-5" />, text: 'Música 100% Exclusiva' },
              { icon: <Clock className="w-5 h-5" />, text: 'Entrega em 5 Minutos' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-wine-300">{item.icon}</span>
                <span className="text-xs sm:text-sm text-white font-bold uppercase tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLANOS ===== */}
      <section id="planos" className="py-10 sm:py-16 md:py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border-2 border-dark-900 shadow-offset-sm mb-6">
              <Crown className="w-4 h-4 text-wine-500" />
              <span className="text-dark-900 text-xs sm:text-sm font-black uppercase tracking-widest">Planos Exclusivos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-dark-900 mb-4 tracking-tight">
              Escolha Seu{' '}
              <span className="text-wine-500">Plano</span>
            </h2>
            <p className="text-dark-600 text-base sm:text-lg max-w-2xl mx-auto font-medium">
              Uma música exclusiva e emocionante, feita especialmente para o seu momento.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 max-w-3xl mx-auto">
            {PLANOS.map((plano, index) => {
              const isPremium = plano.id === 'premium';
              const isBasico = plano.id === 'basico';
              return (
                <motion.div
                  key={plano.id}
                  initial={{ opacity: 0, y: 30, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: isPremium ? -1 : 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative group`}
                >
                  <div className={`relative bg-white rounded-3xl p-6 sm:p-8 transition-all duration-500 border-2 border-dark-900 card-hover ${
                    isPremium
                      ? 'shadow-offset bg-soft-50'
                      : 'shadow-offset-sm'
                  }`}>
                    {/* Badge Mais Vendido no Premium */}
                    {isPremium && plano.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <span className="bg-wine-500 text-white text-[10px] sm:text-xs font-black px-6 py-2 rounded-full flex items-center gap-1.5 whitespace-nowrap border-2 border-dark-900 shadow-offset-sm uppercase tracking-wider">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {plano.highlight}
                        </span>
                      </div>
                    )}

                    <div className="text-center pt-4 mb-6">
                      <h3 className="text-xl font-black text-dark-900 mb-2 uppercase tracking-wide">{plano.name}</h3>

                      {/* Badge de melodias para Premium */}
                      {isPremium && (
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-dark-900 rounded-full mb-3">
                          <Music className="w-3 h-3 text-wine-300" />
                          <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider">{plano.melodias} Músicas Completas</span>
                        </div>
                      )}
                      {isBasico && <div className="mb-3" />}

                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm text-dark-600 font-bold">R$</span>
                        <span className="text-5xl sm:text-6xl font-black text-dark-900">
                          {Math.floor(plano.price)}
                        </span>
                        <span className="text-xl font-black text-dark-600">,{plano.price.toFixed(2).split('.')[1] || '00'}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-wine-500" />
                        <span className="text-sm text-dark-700 font-bold">
                          Entrega <span className="font-black text-dark-900 uppercase">{plano.entrega}</span>
                        </span>
                      </div>
                    </div>

                    {/* Badge Exclusivo do Site no Básico */}
                    {isBasico && (
                      <div className="flex justify-center mb-4">
                        <span className="bg-[#6B5E9E] text-white text-[10px] sm:text-xs font-black px-5 py-1.5 rounded-full border-2 border-dark-900 uppercase tracking-wider">
                          Exclusivo Site
                        </span>
                      </div>
                    )}

                    <div className="h-[3px] bg-dark-900/10 mb-6 rounded" />

                    <ul className="space-y-3.5 mb-6">
                      {plano.features.map((feature, i) => {
                        const isBold = feature.includes('2 músicas') || feature.includes('Entrega em 5 minutos') || feature.includes('Prioridade');
                        return (
                          <li key={i} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 ${
                              isPremium
                                ? 'bg-dark-900 border-dark-900 text-white'
                                : 'bg-wine-500 border-wine-500 text-white'
                            }`}>
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                            <span className={`text-sm text-dark-800 ${isBold ? 'font-black' : 'font-semibold'}`}>{feature}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <button
                      onClick={() => openModalWithPlan(plano.id)}
                      className={`btn-bold w-full py-4 text-sm sm:text-base ${
                        isPremium
                          ? 'bg-dark-900 text-white'
                          : 'bg-wine-500 text-white'
                      }`}
                    >
                      <Music className="w-4 h-4" />
                      {isPremium ? `Criar Minhas ${plano.melodias} Músicas` : 'Criar Minha Música'}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 mt-4">
                      <Shield className="w-3.5 h-3.5 text-sage-500" />
                      <p className="text-[10px] sm:text-xs text-dark-600 font-semibold">
                        Satisfação garantida ou seu dinheiro de volta
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Divider ===== */}
      <div className="hidden md:block section-divider mx-8 sm:mx-16 rounded" />

      {/* ===== COMO FUNCIONA ===== */}
      <section id="como-funciona" className="py-10 sm:py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border-2 border-dark-900 shadow-offset-sm mb-6">
              <Sparkles className="w-4 h-4 text-wine-500" />
              <span className="text-dark-900 text-xs sm:text-sm font-black uppercase tracking-widest">Processo Simples</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-dark-900 mb-4 tracking-tight">
              Como{' '}
              <span className="text-wine-500">Funciona</span>
            </h2>
            <p className="text-dark-600 text-base sm:text-lg max-w-2xl mx-auto font-medium">
              Em apenas 3 passos, crie uma música exclusiva e emocionante
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                icon: <MessageCircle className="w-7 h-7" />,
                title: 'Conte sua história',
                description: 'Preencha um formulário com detalhes sobre a pessoa especial e o momento que deseja eternizar.',
                iconBg: 'bg-soft-200 text-wine-500',
                rotate: 'rotate-[-2deg]',
              },
              {
                step: '02',
                icon: <Edit3 className="w-7 h-7" />,
                title: 'Aprove a letra',
                description: 'Nossa equipe cria uma letra personalizada. Você aprova ou edita quantas vezes quiser.',
                iconBg: 'bg-gold-100 text-gold-700',
                rotate: 'rotate-[1deg]',
              },
              {
                step: '03',
                icon: <Headphones className="w-7 h-7" />,
                title: 'Receba sua música',
                description: 'Receba sua música exclusiva produzida profissionalmente em alta qualidade direto no site.',
                iconBg: 'bg-soft-200 text-dark-900',
                rotate: 'rotate-[-1deg]',
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative group ${item.rotate}`}
              >
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-dark-900 card-hover shadow-offset">
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-dark-900 flex items-center justify-center text-white font-black text-sm border-2 border-dark-900 shadow-md">
                    {item.step}
                  </div>
                  <div className={`w-16 h-16 rounded-2xl ${item.iconBg} flex items-center justify-center mb-5 border-2 border-dark-900/10`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-dark-900 mb-3 uppercase tracking-wide">{item.title}</h3>
                  <p className="text-dark-600 leading-relaxed text-sm sm:text-base font-medium">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-bold px-8 sm:px-12 py-4 sm:py-5 bg-dark-900 text-white text-base sm:text-lg"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      <PortfolioSection />

      {/* ===== DEPOIMENTOS ===== */}
      <section id="depoimentos" className="py-10 sm:py-16 md:py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border-2 border-dark-900 shadow-offset-sm mb-6">
              <Heart className="w-4 h-4 text-wine-500 fill-wine-500" />
              <span className="text-dark-900 text-xs sm:text-sm font-black uppercase tracking-widest">Depoimentos Reais</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-dark-900 mb-4 tracking-tight">
              Histórias de Quem{' '}
              <span className="text-wine-500">Se Emocionou</span>
            </h2>
            <p className="text-dark-600 text-base sm:text-lg max-w-2xl mx-auto font-medium">
              Veja o que nossos clientes dizem sobre suas músicas personalizadas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {TESTIMONIALS.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: index === 1 ? -1 : index === 2 ? 1 : 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all border-2 border-dark-900 shadow-offset card-hover"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-wine-500 fill-wine-500" />
                  ))}
                </div>
                <p className="text-dark-700 text-sm sm:text-base leading-relaxed mb-5 italic font-medium">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {testimonial.image && (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={44}
                      height={44}
                      className="rounded-full object-cover border-2 border-dark-900"
                    />
                  )}
                  <div>
                    <p className="font-black text-dark-900 text-sm">{testimonial.name}</p>
                    <p className="text-dark-600 text-xs font-semibold">{testimonial.role} · {testimonial.serviceType}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mt-5 sm:mt-6 max-w-3xl mx-auto">
            {TESTIMONIALS.slice(3, 5).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 3) * 0.1 }}
                className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all border-2 border-dark-900 shadow-offset card-hover ${index === 0 ? 'rotate-[1deg]' : 'rotate-[-1deg]'}`}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-wine-500 fill-wine-500" />
                  ))}
                </div>
                <p className="text-dark-700 text-sm sm:text-base leading-relaxed mb-5 italic font-medium">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {testimonial.image && (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={44}
                      height={44}
                      className="rounded-full object-cover border-2 border-dark-900"
                    />
                  )}
                  <div>
                    <p className="font-black text-dark-900 text-sm">{testimonial.name}</p>
                    <p className="text-dark-600 text-xs font-semibold">{testimonial.role} · {testimonial.serviceType}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Divider ===== */}
      <div className="hidden md:block section-divider mx-8 sm:mx-16 rounded" />

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-10 sm:py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border-2 border-dark-900 shadow-offset-sm mb-6">
              <MessageCircle className="w-4 h-4 text-gold-600" />
              <span className="text-dark-900 text-xs sm:text-sm font-black uppercase tracking-widest">Tire suas dúvidas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-dark-900 mb-4 tracking-tight">
              Dúvidas{' '}
              <span className="text-wine-500">Frequentes</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                  openFaq === index ? 'border-dark-900 shadow-offset' : 'border-dark-900/20 hover:border-dark-900'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className="font-bold text-dark-900 pr-4 text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-dark-900 transition-transform duration-300 flex-shrink-0 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-dark-600 leading-relaxed text-sm sm:text-base font-medium">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section id="criar-musica" className="py-10 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-900" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-[15%] left-[10%] text-wine-400/30 text-2xl md:text-4xl md:text-wine-400/40 animate-float">{'♪'}</span>
          <span className="absolute top-[25%] right-[15%] text-gold-500/20 text-xl md:text-5xl md:text-gold-500/30 animate-float" style={{ animationDelay: '1s' }}>{'♫'}</span>
          <span className="hidden md:block absolute bottom-[20%] left-[20%] text-wine-300/30 text-4xl animate-float" style={{ animationDelay: '2s' }}>{'♬'}</span>
          <span className="hidden md:block absolute bottom-[30%] right-[10%] text-gold-400/30 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>{'𝄞'}</span>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Pronto para criar uma música{' '}
              <span className="text-wine-300">inesquecível?</span>
            </h2>
            <p className="text-wine-200/70 text-base sm:text-lg mb-10 max-w-2xl mx-auto font-medium">
              Eternize seu momento especial com uma música única, criada com amor e profissionalismo.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-wine-400 fill-wine-400" />
                <span className="text-sm font-bold text-white">Emocione quem você ama</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-gold-400" />
                <span className="text-sm font-bold text-white">Inédita e exclusiva</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-wine-300" />
                <span className="text-sm font-bold text-white">Lembrança eterna</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-3 px-10 sm:px-14 py-4 sm:py-5 bg-white text-dark-900 text-base sm:text-xl font-black rounded-full border-2 border-white hover:bg-wine-500 hover:text-white hover:border-wine-500 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(131,122,182,0.5)]"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              Criar Minha Música Agora
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 sm:py-16 bg-dark-900 border-t-4 border-wine-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8">
            <div className="sm:col-span-2">
              <div className="flex items-center mb-5">
                <LogoSVG className="h-10 w-auto [&_text]:fill-white [&_circle]:fill-white/10" />
              </div>
              <p className="text-white/70 mb-6 max-w-sm text-sm font-medium">{COMPANY_INFO.description}</p>
              <div className="flex items-center gap-3">
                <a href={`https://instagram.com/${COMPANY_INFO.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-wine-500 hover:text-white transition-all border border-white/10 hover:border-wine-500">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={`https://youtube.com/${COMPANY_INFO.youtube}`} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-wine-500 hover:text-white transition-all border border-white/10 hover:border-wine-500">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="hidden md:block">
              <h4 className="font-black text-white mb-5 text-sm uppercase tracking-wider">Navegação</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Como Funciona', id: 'como-funciona' },
                  { label: 'Portfólio', id: 'portfolio' },
                  { label: 'Depoimentos', id: 'depoimentos' },
                  { label: 'Dúvidas', id: 'faq' },
                ].map((item) => (
                  <li key={item.id}>
                    <button onClick={() => scrollToSection(item.id)} className="text-white/70 hover:text-wine-300 transition-colors text-sm font-semibold">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-5 text-sm uppercase tracking-wider">Contato</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/70 text-sm font-semibold">
                  <Mail className="w-4 h-4 text-wine-400" />
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-wine-300 transition-colors">
                    {COMPANY_INFO.email}
                  </a>
                </li>
                <li className="flex items-center gap-2 text-white/70 text-sm font-semibold">
                  <Instagram className="w-4 h-4 text-wine-400" />
                  <a href={`https://instagram.com/${COMPANY_INFO.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-wine-300 transition-colors">
                    {COMPANY_INFO.instagram}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-white/50 text-sm font-semibold">
              &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <SocialProofNotification />

      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SimpleBookingForm onClose={() => setIsModalOpen(false)} selectedPlanId={selectedPlan} />
      </CheckoutModal>
    </main>
  );
}
