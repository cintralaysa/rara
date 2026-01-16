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
    <main className="min-h-screen overflow-hidden bg-[#f8fafc]">
      {/* Subtle pattern background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(30,58,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Soft gradient accents */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-blue-200 shadow-lg shadow-blue-100/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-900/30">
                <Music className="w-6 h-6 text-amber-400" />
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
              className="group px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-blue-900 font-bold rounded-full hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-amber-500/40 hover:shadow-xl hover:shadow-amber-500/50 hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              Criar Música
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
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full border border-blue-300 mb-6 shadow-lg shadow-blue-200/30">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-400/50" />
                <span className="text-blue-800 text-sm font-semibold tracking-wide">100% Exclusiva e Personalizada</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 leading-[1.1] mb-8">
                Sua história vira{' '}
                <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  música exclusiva
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed font-light">
                Conte sua história e nossa equipe transforma em uma canção única.
                <span className="text-amber-600 font-semibold"> Receba sua melodia exclusiva</span> produzida profissionalmente.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group px-10 py-5 bg-gradient-to-r from-blue-800 via-blue-900 to-slate-900 text-amber-400 text-lg font-bold rounded-full hover:from-blue-700 hover:via-blue-800 hover:to-slate-800 transition-all duration-300 shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:shadow-blue-900/40 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <Wand2 className="w-6 h-6" />
                  Criar Minha Música
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="px-10 py-5 bg-white text-slate-700 text-lg font-semibold rounded-full border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                >
                  <Play className="w-6 h-6 text-amber-500" />
                  Ouvir Exemplos
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="relative group">
                  <div className="relative bg-white backdrop-blur-xl border-2 border-blue-200 rounded-2xl px-7 py-5 shadow-lg shadow-blue-100/50 hover:shadow-xl hover:border-blue-300 transition-all">
                    <p className="text-4xl font-black text-slate-800">+5.000</p>
                    <p className="text-slate-600 text-sm font-medium">Pessoas satisfeitas</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="relative bg-white backdrop-blur-xl border-2 border-blue-200 rounded-2xl px-7 py-5 shadow-lg shadow-blue-100/50 hover:shadow-xl hover:border-blue-300 transition-all">
                    <p className="text-4xl font-black bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">100%</p>
                    <p className="text-slate-600 text-sm font-medium flex items-center gap-1">
                      <Music className="w-4 h-4 text-amber-500" />
                      Música exclusiva
                    </p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="relative bg-white backdrop-blur-xl border-2 border-blue-200 rounded-2xl px-7 py-5 shadow-lg shadow-blue-100/50 hover:shadow-xl hover:border-blue-300 transition-all">
                    <p className="text-4xl font-black text-slate-800 flex items-center gap-2">
                      <Clock className="w-8 h-8 text-amber-500" />
                    </p>
                    <p className="text-slate-600 text-sm font-medium">Entrega rápida</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300/40 to-blue-400/40 animate-pulse blur-2xl" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/30 to-yellow-200/30 animate-pulse blur-3xl" style={{ animationDelay: '0.5s' }} />

                {/* Main circle */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 backdrop-blur-xl shadow-xl" />

                {/* Inner visualization */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-blue-800 to-blue-900 border-2 border-blue-700 flex items-center justify-center overflow-hidden shadow-2xl">
                  {/* Animated waveform */}
                  <div className="flex items-end gap-1.5 h-28">
                    {[...Array(14)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2.5 rounded-full bg-amber-400 shadow-lg"
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
                  className="absolute -top-4 right-4 bg-white backdrop-blur-xl rounded-2xl border-2 border-blue-200 p-4 flex items-center gap-3 shadow-xl"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-900/30">
                    <Clock className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-base">Entrega Rápida</p>
                    <p className="text-sm text-slate-600">Escolha seu plano</p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 left-4 bg-white backdrop-blur-xl rounded-2xl border-2 border-blue-200 p-5 shadow-xl"
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
                  className="absolute top-1/2 -right-8 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl p-5 shadow-2xl"
                  animate={{ x: [0, 8, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-blue-900 font-black text-2xl">100%</p>
                  <p className="text-blue-900/80 text-sm font-medium">Personalizada</p>
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
          <ChevronDown className="w-8 h-8 text-blue-400" />
        </motion.div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-28 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full border border-blue-300 mb-6 shadow-lg shadow-blue-200/30">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-blue-800 text-sm font-semibold">Processo Simples</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">
              Como{' '}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">funciona</span>
            </h2>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">
              Em apenas 3 passos simples, você cria uma música exclusiva e emocionante
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <MessageCircle className="w-8 h-8" />,
                title: 'Conte sua história',
                description: 'Preencha um formulário com detalhes sobre a pessoa especial, memórias marcantes e o momento que deseja eternizar.'
              },
              {
                step: '02',
                icon: <Edit3 className="w-8 h-8" />,
                title: 'Criamos a letra',
                description: 'Nossa equipe de compositores cria uma letra personalizada e exclusiva baseada na sua história.'
              },
              {
                step: '03',
                icon: <Headphones className="w-8 h-8" />,
                title: 'Receba sua música',
                description: 'Você recebe sua música exclusiva com letra personalizada, produzida profissionalmente em alta qualidade. Prazo varia conforme o plano escolhido.'
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
                  <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 via-blue-300 to-transparent z-0" />
                )}

                <div className="relative bg-gradient-to-br from-blue-50 to-slate-50 backdrop-blur-xl border-2 border-blue-200 rounded-3xl p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-500">
                  {/* Step number */}
                  <div className="absolute -top-5 -right-5 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center text-blue-900 font-black text-xl shadow-xl">
                    {item.step}
                  </div>

                  <div className="relative">
                    <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-amber-600 mb-6 border border-blue-300 shadow-lg p-4">
                      {item.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-base">
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
            className="text-center mt-20"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-12 py-5 bg-gradient-to-r from-blue-800 via-blue-900 to-slate-900 text-amber-400 text-lg font-bold rounded-full hover:from-blue-700 hover:via-blue-800 hover:to-slate-800 transition-all duration-300 shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:shadow-blue-900/40 hover:-translate-y-1 inline-flex items-center gap-3"
            >
              Começar Agora
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-28 relative bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full border border-blue-300 mb-6 shadow-lg">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-blue-800 text-sm font-bold">Escolha seu Plano</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
              Sua Historia em{' '}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Melodia</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
              Uma musica exclusiva e emocionante, criada especialmente para eternizar seu momento mais especial.
            </p>

            {/* Badge Oferta Exclusiva */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-full border border-red-200 shadow-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-700 font-bold text-sm">Precos exclusivos apenas pelo site</span>
            </div>
          </motion.div>

          {/* Planos Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PLANOS.map((plano, index) => (
              <motion.div
                key={plano.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  plano.popular
                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                    : 'border-blue-200'
                }`}
              >
                {/* Badge Popular */}
                {plano.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-blue-900 text-sm font-bold px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      {plano.highlight}
                    </span>
                  </div>
                )}

                {/* Plano Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{plano.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-slate-500 text-xl">R$</span>
                    <span className="text-5xl font-black text-slate-800">
                      {Math.floor(plano.price)}
                    </span>
                    <span className="text-2xl font-bold text-slate-600">,{String(plano.price).split('.')[1] || '00'}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Entrega em {plano.entrega}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plano.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plano.popular
                          ? 'bg-gradient-to-br from-amber-500 to-yellow-500'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => openModalWithPlan(plano.id)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    plano.popular
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-blue-900 hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/30'
                      : 'bg-gradient-to-r from-blue-800 to-blue-900 text-amber-400 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-900/30'
                  }`}
                >
                  <Wand2 className="w-5 h-5" />
                  Criar Minha Musica
                </button>

                {/* Garantia */}
                <p className="text-center text-xs mt-4 text-slate-500">
                  Satisfacao garantida ou seu dinheiro de volta
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <div className="bg-white">
        <PortfolioSection />
      </div>

      {/* Depoimentos Section */}
      <section id="depoimentos" className="py-28 relative bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full border border-blue-300 mb-6 shadow-lg">
              <Heart className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-blue-800 text-sm font-semibold">Depoimentos Reais</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">
              Histórias de quem já{' '}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">se emocionou</span>
            </h2>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">
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
                className="bg-white backdrop-blur-xl border-2 border-blue-200 rounded-3xl p-10 md:p-14 text-center shadow-2xl"
              >
                <Quote className="w-14 h-14 text-amber-500/60 mx-auto mb-8" />

                <p className="text-2xl md:text-3xl text-slate-700 mb-10 leading-relaxed italic font-light">
                  &quot;{TESTIMONIALS[currentTestimonial].content}&quot;
                </p>

                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                <div>
                  <p className="font-bold text-slate-800 text-xl">
                    {TESTIMONIALS[currentTestimonial].name}
                  </p>
                  <p className="text-slate-500 text-base">
                    {TESTIMONIALS[currentTestimonial].role} - {TESTIMONIALS[currentTestimonial].serviceType}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex justify-center gap-3 mt-10">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-gradient-to-r from-blue-700 to-blue-900 w-10 shadow-lg'
                      : 'bg-blue-200 hover:bg-blue-400 w-3'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full border border-blue-300 mb-6">
              <MessageCircle className="w-4 h-4 text-amber-500" />
              <span className="text-blue-800 text-sm font-medium">Dúvidas Frequentes</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Perguntas{' '}
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">frequentes</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gradient-to-br from-blue-50 to-slate-50 backdrop-blur-sm border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  openFaq === index ? 'border-blue-400 shadow-lg' : 'border-blue-200'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-slate-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 transition-transform duration-300 flex-shrink-0 ${
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
                      <p className="px-6 pb-6 text-slate-600 leading-relaxed">
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
      <section id="criar-musica" className="py-32 relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-amber-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 rounded-full border border-amber-500/30 mb-8">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold">Comece Agora</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Pronto para criar uma música{' '}
              <span className="text-amber-400">inesquecível?</span>
            </h2>

            <p className="text-blue-100/90 text-xl mb-12 max-w-2xl mx-auto">
              Em apenas alguns minutos você dá o primeiro passo para eternizar seu momento especial
              com uma música única e exclusiva.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-14">
              <div className="bg-white backdrop-blur-xl rounded-2xl px-10 py-8 text-center shadow-2xl">
                <Heart className="w-10 h-10 text-amber-500 mx-auto mb-2 fill-amber-500" />
                <p className="text-2xl font-black text-slate-800">Emocione</p>
                <p className="text-slate-600 font-medium">quem voce ama</p>
              </div>
              <div className="bg-white backdrop-blur-xl rounded-2xl px-10 py-8 text-center shadow-2xl">
                <Music className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-800">Musica Inedita</p>
                <p className="text-slate-600 font-medium">feita so pra voce</p>
              </div>
              <div className="bg-white backdrop-blur-xl rounded-2xl px-10 py-8 text-center shadow-2xl">
                <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-800">Para Sempre</p>
                <p className="text-slate-600 font-medium">uma lembranca eterna</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-14 py-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-blue-900 text-xl font-black rounded-full hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 shadow-2xl hover:-translate-y-2 inline-flex items-center gap-4"
            >
              <Wand2 className="w-7 h-7" />
              Criar Minha Música Agora
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center shadow-lg">
                  <Music className="w-7 h-7 text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-white">Melodia Rara</span>
              </div>
              <p className="text-slate-400 mb-8 max-w-sm text-lg">
                {COMPANY_INFO.description}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href={`https://instagram.com/${COMPANY_INFO.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-blue-900 hover:border-transparent transition-all duration-300"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href={`https://youtube.com/${COMPANY_INFO.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-blue-900 hover:border-transparent transition-all duration-300"
                >
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Navegação</h4>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => scrollToSection('como-funciona')}
                    className="text-slate-400 hover:text-amber-400 transition-colors font-medium"
                  >
                    Como Funciona
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('portfolio')}
                    className="text-slate-400 hover:text-amber-400 transition-colors font-medium"
                  >
                    Portfolio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('depoimentos')}
                    className="text-slate-400 hover:text-amber-400 transition-colors font-medium"
                  >
                    Depoimentos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="text-slate-400 hover:text-amber-400 transition-colors font-medium"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-400">
                  <Mail className="w-5 h-5 text-amber-400" />
                  {COMPANY_INFO.email}
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Phone className="w-5 h-5 text-amber-400" />
                  WhatsApp
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-10 text-center">
            <p className="text-slate-500 text-base">
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
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.7)] hover:scale-110 transition-all duration-300 z-50"
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
