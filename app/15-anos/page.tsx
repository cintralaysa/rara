'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Music,
  Heart,
  Star,
  ChevronDown,
  MessageCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Quote,
  Wand2,
  Edit3,
  Crown,
  Check,
  Zap,
  Play,
  Pause
} from 'lucide-react';
import { PLANOS, COMPANY_INFO } from '@/lib/data';
import CheckoutModal from '@/components/CheckoutModal';
import SimpleBookingForm from '@/components/SimpleBookingForm';

// Depoimentos específicos para 15 Anos
const TESTIMONIALS_15 = [
  {
    name: "Maria Clara",
    role: "Debutante",
    content: "Quando a música começou a tocar e eu ouvi meu nome, não consegui segurar as lágrimas! Foi o momento mais emocionante da minha festa. Todos os convidados choraram junto!",
    rating: 5
  },
  {
    name: "Fernanda (mãe da Isabela)",
    role: "Mãe da debutante",
    content: "Queríamos surpreender nossa filha e conseguimos! A música contou toda a história dela, desde bebê até se tornar essa mulher linda. Valeu cada centavo!",
    rating: 5
  },
  {
    name: "Ana Beatriz",
    role: "Debutante",
    content: "Minha valsa foi única! Nenhuma outra debutante vai ter uma música igual à minha. É minha para sempre! Recomendo demais!",
    rating: 5
  }
];

// FAQs específicos para 15 Anos
const FAQS_15 = [
  {
    question: "A música pode ser usada como valsa?",
    answer: "Com certeza! Criamos a música no estilo e ritmo que você escolher, perfeita para a valsa com o pai, com os 15 casais, ou para aquele momento especial da festa."
  },
  {
    question: "Posso incluir nomes de familiares na letra?",
    answer: "Sim! Podemos mencionar pais, avós, padrinhos, irmãos ou qualquer pessoa especial que você queira homenagear na letra da sua música."
  },
  {
    question: "Qual estilo musical vocês fazem?",
    answer: "Trabalhamos com diversos estilos: romântico, pop, sertanejo, MPB, valsa clássica e muito mais. Você escolhe o que combina mais com você!"
  },
  {
    question: "Em quanto tempo recebo a música?",
    answer: "No Plano Básico a entrega é em até 5 dias úteis, e no Plano Premium em até 48 horas. Recomendamos encomendar com antecedência para ter tempo de ensaiar!"
  },
  {
    question: "Posso usar a música em vídeos e redes sociais?",
    answer: "Sim! A música é 100% sua. Você pode usar no vídeo da festa, postar nas redes sociais, fazer o que quiser. É exclusiva e personalizada para você!"
  }
];

// Portfolio específico para 15 anos (será preenchido pelo usuário)
const PORTFOLIO_15_ANOS = [
  {
    id: 1,
    title: "Valsa da Maria Clara",
    description: "Uma valsa emocionante para o momento com o pai",
    audioUrl: "", // Será preenchido
    style: "Valsa Romântica"
  }
];

export default function QuinzeAnosPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS_15.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      {/* Decorative elements - mais vibrantes */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-500/30 via-purple-500/20 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-pink-500/30 via-rose-500/20 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header - Elegante */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl shadow-amber-500/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight block">
                  Melodia Rara
                </span>
                <span className="text-xs text-amber-400 font-medium tracking-widest uppercase">15 Anos</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-5 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-900 font-bold rounded-full hover:from-amber-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-amber-500/30 text-sm sm:text-base"
            >
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Criar Minha Valsa</span>
              <span className="sm:hidden">Criar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Com imagem */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full border border-amber-500/40 mb-6 shadow-lg backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 text-sm font-semibold tracking-wide">Música Exclusiva para Debutantes</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                Sua{' '}
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  valsa dos sonhos
                </span>
                {' '}começa aqui
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                Uma música personalizada que conta sua história e transforma seu momento em{' '}
                <span className="text-amber-400 font-semibold">algo inesquecível</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-900 text-base sm:text-lg font-bold rounded-full hover:from-amber-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
                  Criar Minha Valsa
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-sm font-medium">+300 debutantes</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
                  </div>
                  <span className="text-sm font-medium">100% exclusiva</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">Entrega em 48h</span>
                </div>
              </div>
            </motion.div>

            {/* Imagem da debutante */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative">
                {/* Glow effect behind image */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/40 via-purple-500/40 to-blue-500/40 rounded-3xl blur-2xl opacity-60" />

                {/* Main image container */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20">
                  <div className="aspect-[4/5] relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
                    <Image
                      src="/images/portfolio/debutante-hero.jpg"
                      alt="Debutante em sua festa de 15 anos"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Overlay gradiente elegante */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10" />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-slate-950/80 backdrop-blur-xl rounded-2xl p-4 border border-amber-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">Sua noite especial</p>
                          <p className="text-amber-400 text-xs">Com uma valsa única e exclusiva</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-xl opacity-40" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-40" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-amber-400/60" />
        </motion.div>
      </section>

      {/* Como funciona */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
              Como <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">funciona</span>?
            </h2>
            <p className="text-slate-400">Simples, rápido e emocionante!</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Edit3 className="w-6 h-6" />, title: "Conte sua história", desc: "Fale sobre você, sua família e momentos especiais", gradient: "from-amber-400 to-yellow-500" },
              { icon: <Music className="w-6 h-6" />, title: "Criamos sua música", desc: "Letra e melodia exclusivas para você", gradient: "from-purple-400 to-pink-500" },
              { icon: <Heart className="w-6 h-6" />, title: "Emocione a todos", desc: "Dance sua valsa com uma música única!", gradient: "from-blue-400 to-cyan-500" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full border border-amber-500/30 mb-6">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 text-sm font-bold tracking-wide">PLANOS ESPECIAIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Escolha seu{' '}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">plano</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
              Uma valsa que ninguém mais vai ter igual!
            </p>
          </motion.div>

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
                {plano.popular && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded-[28px] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                )}

                <div className={`relative bg-gradient-to-br ${
                  plano.popular
                    ? 'from-slate-800/90 via-slate-900/95 to-slate-800/90 border-amber-500/50'
                    : 'from-white/10 to-white/5 border-white/20'
                } backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-2 transition-all duration-500 hover:-translate-y-1`}>

                  {plano.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-slate-900 text-xs sm:text-sm font-black px-4 sm:px-6 py-2 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        MAIS ESCOLHIDO
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6 sm:mb-8 pt-2">
                    <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${plano.popular ? 'text-white' : 'text-white/90'}`}>{plano.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-lg ${plano.popular ? 'text-amber-400' : 'text-purple-300'}`}>R$</span>
                      <span className={`text-4xl sm:text-5xl font-black ${plano.popular ? 'text-white' : 'text-white/90'}`}>
                        {Math.floor(plano.price)}
                      </span>
                      <span className={`text-xl font-bold ${plano.popular ? 'text-white/70' : 'text-white/60'}`}>,{String(plano.price).split('.')[1] || '00'}</span>
                    </div>
                    <p className={`text-xs sm:text-sm mt-2 ${plano.popular ? 'text-amber-400/80' : 'text-purple-300/80'}`}>Entrega em {plano.entrega}</p>
                  </div>

                  <div className={`h-px mb-6 ${plano.popular ? 'bg-gradient-to-r from-transparent via-amber-500/50 to-transparent' : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'}`} />

                  <ul className="space-y-3 mb-6">
                    {plano.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plano.popular
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                            : 'bg-gradient-to-br from-purple-500 to-purple-600'
                        }`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className={`text-sm ${plano.popular ? 'text-white/90' : 'text-white/70'}`}>{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plano.popular
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                          : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-sm ${plano.popular ? 'text-white/90' : 'text-white/70'}`}>Perfeita para valsa e momentos especiais</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => openModalWithPlan(plano.id)}
                    className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      plano.popular
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-slate-900 hover:from-amber-300 hover:via-yellow-400 hover:to-amber-300 shadow-lg shadow-amber-500/30'
                        : 'bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <Crown className="w-5 h-5" />
                    Criar Minha Valsa
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Debutantes que{' '}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">amaram</span>
            </h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-amber-500/20 text-center"
              >
                <Quote className="w-12 h-12 text-amber-400/50 mx-auto mb-6" />
                <p className="text-lg sm:text-xl text-slate-200 mb-6 italic">
                  "{TESTIMONIALS_15[currentTestimonial].content}"
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="font-bold text-white">{TESTIMONIALS_15[currentTestimonial].name}</p>
                <p className="text-sm text-amber-400">{TESTIMONIALS_15[currentTestimonial].role}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS_15.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentTestimonial ? 'w-8 bg-gradient-to-r from-amber-400 to-yellow-500' : 'w-2 bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Dúvidas frequentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS_15.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br from-white/10 to-white/5 border-2 rounded-2xl overflow-hidden transition-all backdrop-blur-sm ${
                  openFaq === index ? 'border-amber-500/50' : 'border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p className="px-5 pb-5 text-slate-300">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_40%)]" />

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown className="w-16 h-16 text-white/90 mx-auto mb-6 drop-shadow-lg" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">
              Sua festa merece uma valsa única!
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Crie agora a música que vai marcar para sempre a sua entrada nos 15 anos!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-10 py-5 bg-slate-900 text-white text-lg font-black rounded-full hover:bg-slate-800 transition-all shadow-2xl hover:-translate-y-1 inline-flex items-center gap-3"
            >
              <Wand2 className="w-6 h-6" />
              Criar Minha Música
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer elegante */}
      <footer className="py-10 bg-slate-950 text-center border-t border-white/10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold">Melodia Rara</span>
        </div>
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Melodia Rara. Todos os direitos reservados.
        </p>
        <a href="/" className="text-amber-400 text-sm hover:underline mt-2 inline-block">
          ← Voltar para página principal
        </a>
      </footer>

      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-50"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      {/* Modal */}
      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SimpleBookingForm
          onClose={() => setIsModalOpen(false)}
          selectedPlanId={selectedPlan}
          preSelectedOccasion="aniversario"
          preSelectedRelationship="filho"
        />
      </CheckoutModal>
    </main>
  );
}
