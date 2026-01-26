'use client';

import { useState, useEffect } from 'react';
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
  Phone,
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
  Zap,
  Wand2,
  Edit3,
  Crown,
  Check
} from 'lucide-react';
import { TESTIMONIALS, FAQS, COMPANY_INFO, PLANOS } from '@/lib/data';
import CheckoutModal from '@/components/CheckoutModal';
import SimpleBookingForm from '@/components/SimpleBookingForm';
import PortfolioSection from '@/components/PortfolioSection';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string>('basico');

  const openModalWithPlan = (planId: string) => {
    setSelectedPlan(planId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#FDFBF7]">
      {/* Subtle pattern background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Soft gradient accents */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-rose-200/30 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-amber-200/50 shadow-lg shadow-amber-900/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                Melodia Rara
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('como-funciona')}
                className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
              >
                Como Funciona
              </button>
              <button
                onClick={() => scrollToSection('portfolio')}
                className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection('depoimentos')}
                className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
              >
                Depoimentos
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
              >
                FAQ
              </button>
            </nav>

            {/* CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center gap-1 sm:gap-2 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Criar Música</span>
              <span className="sm:hidden">Criar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full border border-amber-300/50 mb-6 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-400/50" />
                <span className="text-amber-700 text-sm font-semibold tracking-wide">100% Exclusiva e Personalizada</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 leading-[1.1] mb-6 sm:mb-8">
                Sua história vira{' '}
                <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 bg-clip-text text-transparent">
                  música exclusiva
                </span>
              </h1>

              <p className="text-base sm:text-xl md:text-2xl text-slate-600 mb-6 sm:mb-10 leading-relaxed font-light">
                Conte sua história e nossa equipe transforma em uma canção única.
                <span className="text-amber-600 font-semibold"> Receba sua melodia exclusiva</span> produzida profissionalmente.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-base sm:text-lg font-bold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 sm:gap-3"
                >
                  <Wand2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  Criar Minha Música
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="px-6 sm:px-10 py-4 sm:py-5 bg-white text-slate-700 text-base sm:text-lg font-semibold rounded-full border-2 border-slate-200 hover:bg-slate-50 hover:border-amber-300 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                  Ouvir Exemplos
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-6">
                <div className="relative group">
                  <div className="relative bg-white backdrop-blur-xl border border-slate-200 rounded-xl sm:rounded-2xl px-3 sm:px-7 py-3 sm:py-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-amber-300 transition-all">
                    <p className="text-xl sm:text-4xl font-black text-slate-800">+5.000</p>
                    <p className="text-slate-500 text-[10px] sm:text-sm font-medium">Pessoas satisfeitas</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="relative bg-white backdrop-blur-xl border border-slate-200 rounded-xl sm:rounded-2xl px-3 sm:px-7 py-3 sm:py-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-amber-300 transition-all">
                    <p className="text-xl sm:text-4xl font-black bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">100%</p>
                    <p className="text-slate-500 text-[10px] sm:text-sm font-medium flex items-center gap-1">
                      <Music className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                      Exclusiva
                    </p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="relative bg-white backdrop-blur-xl border border-slate-200 rounded-xl sm:rounded-2xl px-3 sm:px-7 py-3 sm:py-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-amber-300 transition-all">
                    <p className="text-xl sm:text-4xl font-black text-slate-800 flex items-center gap-1 sm:gap-2">
                      <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-amber-500" />
                    </p>
                    <p className="text-slate-500 text-[10px] sm:text-sm font-medium">Entrega rápida</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual - escondido no mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300/30 to-rose-300/30 animate-pulse blur-2xl" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/20 to-rose-200/20 animate-pulse blur-3xl" style={{ animationDelay: '0.5s' }} />

                {/* Main circle */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white to-slate-50 border border-slate-200 backdrop-blur-xl shadow-xl" />

                {/* Inner visualization */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 border-2 border-amber-400 flex items-center justify-center overflow-hidden shadow-2xl">
                  {/* Animated waveform */}
                  <div className="flex items-end gap-1.5 h-28">
                    {[...Array(14)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2.5 rounded-full bg-white shadow-lg"
                        animate={{
                          height: [20, 60 + Math.random() * 50, 20],
                        }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          delay: i * 0.07,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating cards */}
                <motion.div
                  className="absolute -top-4 right-4 bg-white backdrop-blur-xl rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-xl"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-base">Entrega Rápida</p>
                    <p className="text-sm text-slate-500">Escolha seu plano</p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 left-4 bg-white backdrop-blur-xl rounded-2xl border border-slate-200 p-5 shadow-xl"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-base text-slate-800 font-medium">&quot;Ficou incrível!&quot;</p>
                </motion.div>

                {/* 100% Personalizada tag */}
                <motion.div
                  className="absolute top-1/2 -right-8 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl p-5 shadow-2xl"
                  animate={{ x: [0, 8, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-white font-black text-2xl">100%</p>
                  <p className="text-white/90 text-sm font-medium">Personalizada</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-amber-500" />
        </motion.div>
      </section>

      {/* Planos Section - Premium Design */}
      <section id="planos" className="py-20 sm:py-28 relative overflow-hidden">
        {/* Background com gradiente premium */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-amber-50/30 to-rose-50/30" />

        {/* Efeito de luz ambiente */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-300/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-300/20 rounded-full blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full border border-amber-300/50 mb-6">
              <Crown className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600" />
              <span className="text-amber-700 text-xs sm:text-sm font-bold tracking-wide">PLANOS EXCLUSIVOS DO SITE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 sm:mb-6">
              Sua Historia em{' '}
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 bg-clip-text text-transparent">Melodia</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
              Uma musica exclusiva e emocionante, criada especialmente para eternizar seu momento mais especial.
            </p>

            {/* Badge Oferta Exclusiva */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-rose-100 to-rose-50 rounded-full border border-rose-300/50">
              <span className="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-rose-500"></span>
              </span>
              <span className="text-rose-700 font-bold text-xs sm:text-sm">Precos exclusivos apenas pelo site</span>
            </div>
          </motion.div>

          {/* Planos Grid - Design Premium */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {PLANOS.map((plano, index) => (
              <motion.div
                key={plano.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative group ${plano.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {/* Glow effect para o plano popular */}
                {plano.popular && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 rounded-[28px] blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                )}

                <div className={`relative bg-white backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                  plano.popular
                    ? 'border-2 border-amber-400/50 shadow-amber-200/50'
                    : 'border border-slate-200 hover:border-amber-300 hover:shadow-amber-100'
                }`}>

                  {/* Badge Popular */}
                  {plano.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs sm:text-sm font-black px-4 sm:px-6 py-2 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-2 whitespace-nowrap">
                        <Crown className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        {plano.highlight}
                      </span>
                    </div>
                  )}

                  {/* Badge Exclusivo Online para plano basico */}
                  {!plano.popular && plano.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                        <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        {plano.highlight}
                      </span>
                    </div>
                  )}

                  {/* Plano Header */}
                  <div className="text-center mb-6 sm:mb-8 pt-2">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-slate-800">{plano.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-lg sm:text-xl text-amber-600">R$</span>
                      <span className="text-4xl sm:text-5xl font-black text-slate-800">
                        {Math.floor(plano.price)}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-500">,{String(plano.price).split('.')[1] || '00'}</span>
                    </div>
                    <p className="text-xs sm:text-sm mt-2 text-amber-600 font-medium">Entrega em {plano.entrega}</p>
                  </div>

                  {/* Divisor */}
                  <div className={`h-px mb-6 sm:mb-8 ${plano.popular ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'}`} />

                  {/* Features */}
                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {plano.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plano.popular
                            ? 'bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg shadow-amber-500/20'
                            : 'bg-gradient-to-br from-slate-600 to-slate-700'
                        }`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => openModalWithPlan(plano.id)}
                    className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      plano.popular
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    <Wand2 className="w-5 h-5" />
                    Criar Minha Musica
                  </button>

                  {/* Garantia */}
                  <p className="text-center text-[10px] sm:text-xs mt-4 text-slate-400">
                    Satisfacao garantida ou seu dinheiro de volta
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-20 sm:py-28 relative bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full border border-amber-300/50 mb-6">
              <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600" />
              <span className="text-amber-700 text-xs sm:text-sm font-semibold">Processo Simples</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 sm:mb-6">
              Como{' '}
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 bg-clip-text text-transparent">funciona</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto">
              Em apenas 3 passos simples, voce cria uma musica exclusiva e emocionante
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                icon: <MessageCircle className="w-7 sm:w-8 h-7 sm:h-8" />,
                title: 'Conte sua historia',
                description: 'Preencha um formulario com detalhes sobre a pessoa especial, memorias marcantes e o momento que deseja eternizar.'
              },
              {
                step: '02',
                icon: <Edit3 className="w-7 sm:w-8 h-7 sm:h-8" />,
                title: 'Criamos a letra',
                description: 'Nossa equipe de compositores cria uma letra personalizada e exclusiva baseada na sua historia.'
              },
              {
                step: '03',
                icon: <Headphones className="w-7 sm:w-8 h-7 sm:h-8" />,
                title: 'Receba sua musica',
                description: 'Voce recebe sua musica exclusiva com letra personalizada, produzida profissionalmente em alta qualidade. Prazo varia conforme o plano escolhido.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative group"
              >
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent z-0" />
                )}

                <div className="relative bg-white backdrop-blur-xl border border-slate-200 rounded-3xl p-6 sm:p-8 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-500">
                  {/* Step number */}
                  <div className="absolute -top-4 sm:-top-5 -right-4 sm:-right-5 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-xl shadow-amber-500/30">
                    {item.step}
                  </div>

                  <div className="relative">
                    <div className="w-16 sm:w-18 h-16 sm:h-18 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-amber-600 mb-5 sm:mb-6 border border-amber-200 shadow-sm p-3 sm:p-4">
                      {item.icon}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-20"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-base sm:text-lg font-bold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 inline-flex items-center gap-2 sm:gap-3"
            >
              Comecar Agora
              <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <div className="bg-slate-50">
        <PortfolioSection />
      </div>

      {/* Depoimentos Section */}
      <section id="depoimentos" className="py-16 sm:py-20 md:py-28 relative bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-rose-100 to-rose-50 rounded-full border border-rose-300/50 mb-4 sm:mb-6">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" />
              <span className="text-rose-700 text-xs sm:text-sm font-semibold">Depoimentos Reais</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 sm:mb-6">
              Histórias de quem já{' '}
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 bg-clip-text text-transparent">se emocionou</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
              Veja o que nossos clientes dizem sobre suas músicas personalizadas
            </p>
          </motion.div>

          {/* Testimonials carousel */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 text-center shadow-xl"
              >
                <Quote className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-amber-400/60 mx-auto mb-4 sm:mb-6 md:mb-8" />

                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-700 mb-6 sm:mb-8 md:mb-10 leading-relaxed italic font-light">
                  &quot;{TESTIMONIALS[currentTestimonial].content}&quot;
                </p>

                <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-4 sm:mb-6">
                  {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                <div>
                  <p className="font-bold text-slate-800 text-lg sm:text-xl">
                    {TESTIMONIALS[currentTestimonial].name}
                  </p>
                  <p className="text-slate-500 text-sm sm:text-base">
                    {TESTIMONIALS[currentTestimonial].role} - {TESTIMONIALS[currentTestimonial].serviceType}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 md:mt-10">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 w-8 sm:w-10 shadow-lg'
                      : 'bg-slate-300 hover:bg-amber-400 w-2.5 sm:w-3'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 md:py-24 relative bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full border border-amber-300/50 mb-4 sm:mb-6">
              <MessageCircle className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 text-xs sm:text-sm font-medium">Dúvidas Frequentes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
              Perguntas{' '}
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">frequentes</span>
            </h2>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white backdrop-blur-sm border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${
                  openFaq === index ? 'border-amber-400 shadow-lg shadow-amber-100' : 'border-slate-200'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left"
                >
                  <span className="font-semibold text-slate-800 pr-4 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-500 transition-transform duration-300 flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
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
                      <p className="px-4 sm:px-6 pb-4 sm:pb-6 text-slate-600 leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="criar-musica" className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-rose-500">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] md:w-[1000px] h-[600px] sm:h-[800px] md:h-[1000px] bg-white/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/20 rounded-full border border-white/30 mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-white text-xs sm:text-sm font-bold">Comece Agora</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8">
              Pronto para criar uma música{' '}
              <span className="text-white/90">inesquecível?</span>
            </h2>

            <p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
              Em apenas alguns minutos você dá o primeiro passo para eternizar seu momento especial
              com uma música única e exclusiva.
            </p>

            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-6 mb-8 sm:mb-14">
              <div className="bg-white/20 backdrop-blur-xl rounded-xl sm:rounded-2xl px-3 sm:px-10 py-4 sm:py-8 text-center shadow-2xl border border-white/30">
                <Heart className="w-6 h-6 sm:w-10 sm:h-10 text-white mx-auto mb-1 sm:mb-2 fill-white" />
                <p className="text-sm sm:text-2xl font-black text-white">Emocione</p>
                <p className="text-white/80 font-medium text-[10px] sm:text-base">quem voce ama</p>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-xl sm:rounded-2xl px-3 sm:px-10 py-4 sm:py-8 text-center shadow-2xl border border-white/30">
                <Music className="w-6 h-6 sm:w-10 sm:h-10 text-white mx-auto mb-1 sm:mb-2" />
                <p className="text-sm sm:text-2xl font-black text-white">Inedita</p>
                <p className="text-white/80 font-medium text-[10px] sm:text-base">so pra voce</p>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-xl sm:rounded-2xl px-3 sm:px-10 py-4 sm:py-8 text-center shadow-2xl border border-white/30">
                <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-white mx-auto mb-1 sm:mb-2" />
                <p className="text-sm sm:text-2xl font-black text-white">Eterna</p>
                <p className="text-white/80 font-medium text-[10px] sm:text-base">lembranca</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-8 sm:px-14 py-4 sm:py-6 bg-white text-amber-600 text-base sm:text-xl font-black rounded-full hover:bg-slate-50 transition-all duration-300 shadow-2xl hover:-translate-y-2 inline-flex items-center gap-2 sm:gap-4"
            >
              <Wand2 className="w-5 h-5 sm:w-7 sm:h-7" />
              <span className="hidden sm:inline">Criar Minha Música Agora</span>
              <span className="sm:hidden">Criar Música</span>
              <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 md:py-20 bg-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <Music className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white">Melodia Rara</span>
              </div>
              <p className="text-slate-400 mb-6 sm:mb-8 max-w-sm text-sm sm:text-base md:text-lg">
                {COMPANY_INFO.description}
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <a
                  href={`https://instagram.com/${COMPANY_INFO.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 hover:bg-gradient-to-r hover:from-amber-500 hover:to-rose-500 hover:text-white hover:border-transparent transition-all duration-300"
                >
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a
                  href={`https://youtube.com/${COMPANY_INFO.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 hover:bg-gradient-to-r hover:from-amber-500 hover:to-rose-500 hover:text-white hover:border-transparent transition-all duration-300"
                >
                  <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-4 sm:mb-6 text-base sm:text-lg">Navegação</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <button
                    onClick={() => scrollToSection('como-funciona')}
                    className="text-slate-400 hover:text-amber-400 transition-colors font-medium text-sm sm:text-base"
                  >
                    Como Funciona
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('portfolio')}
                    className="text-slate-400 hover:text-amber-400 transition-colors font-medium text-sm sm:text-base"
                  >
                    Portfolio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('depoimentos')}
                    className="text-slate-400 hover:text-amber-400 transition-colors font-medium text-sm sm:text-base"
                  >
                    Depoimentos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="text-slate-400 hover:text-amber-400 transition-colors font-medium text-sm sm:text-base"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4 sm:mb-6 text-base sm:text-lg">Contato</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-center gap-2 sm:gap-3 text-slate-400 text-sm sm:text-base">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  {COMPANY_INFO.email}
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-slate-400 text-sm sm:text-base">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  WhatsApp
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 sm:pt-8 md:pt-10 text-center">
            <p className="text-slate-500 text-sm sm:text-base">
              &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.7)] hover:scale-110 transition-all duration-300 z-50"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </a>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SimpleBookingForm onClose={() => setIsModalOpen(false)} selectedPlanId={selectedPlan} />
      </CheckoutModal>
    </main>
  );
}
