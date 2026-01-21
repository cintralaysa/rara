'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Heart,
  Star,
  ChevronDown,
  MessageCircle,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Clock,
  Sparkles,
  Headphones,
  ArrowRight,
  Quote,
  Wand2,
  Edit3,
  Crown,
  Check,
  Baby,
  Zap
} from 'lucide-react';
import { PLANOS, COMPANY_INFO } from '@/lib/data';
import CheckoutModal from '@/components/CheckoutModal';
import SimpleBookingForm from '@/components/SimpleBookingForm';

// Depoimentos específicos para Chá Revelação
const TESTIMONIALS_CHA = [
  {
    name: "Camila Santos",
    role: "Mamãe do Miguel",
    content: "A música tocou no momento da revelação e todo mundo chorou! Foi mágico ver a fumaça azul subindo enquanto a letra falava do nosso bebê. Momento inesquecível!",
    rating: 5,
    serviceType: "Chá Revelação"
  },
  {
    name: "Fernanda e Lucas",
    role: "Papais da Helena",
    content: "Queríamos algo diferente pro nosso chá e a Melodia Rara superou todas as expectativas. A música contou nossa história de amor até a chegada da nossa princesa!",
    rating: 5,
    serviceType: "Chá Revelação"
  },
  {
    name: "Juliana Oliveira",
    role: "Mamãe do Davi",
    content: "Minha sogra não parava de chorar! A letra falava de como o vovô ia ensinar ele a pescar... Foi o presente mais especial que poderíamos dar pra família.",
    rating: 5,
    serviceType: "Chá Revelação"
  }
];

// FAQs específicos para Chá Revelação
const FAQS_CHA = [
  {
    question: "A música pode ter dois finais (menino e menina)?",
    answer: "Sim! Se vocês ainda não sabem o sexo, criamos a música com dois finais diferentes - um para menino e outro para menina. Assim vocês descobrem junto com os convidados no momento da revelação!"
  },
  {
    question: "E se já soubermos o sexo do bebê?",
    answer: "Perfeito! Nesse caso criamos uma letra única e especial já com o nome do bebê, celebrando a chegada dele(a) de forma ainda mais personalizada."
  },
  {
    question: "Posso incluir o nome do bebê na música?",
    answer: "Com certeza! É isso que torna a música única. Incluímos o nome escolhido (ou os dois nomes, caso ainda não saibam o sexo) de forma natural e emocionante na letra."
  },
  {
    question: "Em quanto tempo recebo a música?",
    answer: "Depende do plano escolhido. No Plano Básico a entrega é em até 5 dias úteis, e no Plano Premium em até 48 horas. Entregamos via WhatsApp!"
  },
  {
    question: "Posso pedir alterações na letra?",
    answer: "Sim! Você visualiza e aprova a letra antes de finalizar. Se quiser ajustes, é só pedir que fazemos as alterações necessárias."
  }
];

export default function ChaRevelacaoPage() {
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
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS_CHA.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 via-blue-50 to-white">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-pink-200/40 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/40 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-pink-200 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-800 tracking-tight block">
                  Melodia Rara
                </span>
                <span className="text-xs text-pink-600 font-medium">Chá Revelação</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-full hover:from-pink-400 hover:to-blue-400 transition-all duration-300 flex items-center gap-2 shadow-lg text-sm sm:text-base"
            >
              <Baby className="w-4 h-4" />
              <span className="hidden sm:inline">Criar Música</span>
              <span className="sm:hidden">Criar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-100 to-blue-100 rounded-full border border-pink-300 mb-6 shadow-lg">
                <Baby className="w-5 h-5 text-pink-500" />
                <span className="text-slate-700 text-sm font-semibold">Música Exclusiva para Chá Revelação</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 leading-[1.1] mb-6 sm:mb-8">
                O momento mais{' '}
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  emocionante
                </span>
                {' '}merece uma música única
              </h1>

              <p className="text-base sm:text-xl md:text-2xl text-slate-600 mb-8 sm:mb-10 leading-relaxed">
                Surpreenda sua família com uma canção personalizada que conta a história
                da chegada do seu bebê. <span className="text-pink-600 font-semibold">Menino ou menina?</span>
                {' '}A resposta vem cantada!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-base sm:text-lg font-bold rounded-full hover:from-pink-400 hover:via-purple-400 hover:to-blue-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <Wand2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  Criar Música do Chá
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  </div>
                  <span className="text-sm font-medium">+500 chás revelação</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-500 fill-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Avaliação 5 estrelas</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium">Entrega em até 48h</span>
                </div>
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
          <ChevronDown className="w-8 h-8 text-pink-400" />
        </motion.div>
      </section>

      {/* Como funciona - versão simplificada */}
      <section className="py-16 sm:py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Como funciona?
            </h2>
            <p className="text-slate-600">Simples, rápido e emocionante!</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Edit3 className="w-6 h-6" />, title: "Conte sua história", desc: "Preencha os detalhes sobre vocês e o bebê", color: "pink" },
              { icon: <Music className="w-6 h-6" />, title: "Criamos a música", desc: "Com dois finais ou nome do bebê", color: "purple" },
              { icon: <Heart className="w-6 h-6" />, title: "Emocione a todos", desc: "Toque no chá e faça todos chorarem!", color: "blue" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`text-center p-6 rounded-2xl bg-gradient-to-br from-${item.color}-50 to-white border border-${item.color}-200`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full border border-pink-500/30 mb-6">
              <Crown className="w-5 h-5 text-pink-400" />
              <span className="text-pink-300 text-sm font-bold">PLANOS ESPECIAIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Escolha seu{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">plano</span>
            </h2>
            <p className="text-purple-200/80 text-base sm:text-lg max-w-xl mx-auto">
              Menino ou menina? A revelação mais emocionante da sua vida!
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-[28px] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                )}

                <div className={`relative bg-gradient-to-br ${
                  plano.popular
                    ? 'from-slate-800/90 via-slate-900/95 to-slate-800/90 border-pink-500/50'
                    : 'from-white/10 to-white/5 border-white/20'
                } backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-2 transition-all duration-500 hover:-translate-y-1`}>

                  {plano.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-xs sm:text-sm font-black px-4 sm:px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        MAIS ESCOLHIDO
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6 sm:mb-8 pt-2">
                    <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${plano.popular ? 'text-white' : 'text-white/90'}`}>{plano.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-lg ${plano.popular ? 'text-pink-400' : 'text-purple-300'}`}>R$</span>
                      <span className={`text-4xl sm:text-5xl font-black ${plano.popular ? 'text-white' : 'text-white/90'}`}>
                        {Math.floor(plano.price)}
                      </span>
                      <span className={`text-xl font-bold ${plano.popular ? 'text-white/70' : 'text-white/60'}`}>,{String(plano.price).split('.')[1] || '00'}</span>
                    </div>
                    <p className={`text-xs sm:text-sm mt-2 ${plano.popular ? 'text-pink-400/80' : 'text-purple-300/80'}`}>Entrega em {plano.entrega}</p>
                  </div>

                  <div className={`h-px mb-6 ${plano.popular ? 'bg-gradient-to-r from-transparent via-pink-500/50 to-transparent' : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'}`} />

                  <ul className="space-y-3 mb-6">
                    {plano.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plano.popular
                            ? 'bg-gradient-to-br from-pink-500 to-blue-500'
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
                          ? 'bg-gradient-to-br from-pink-500 to-blue-500'
                          : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-sm ${plano.popular ? 'text-white/90' : 'text-white/70'}`}>Dois finais (menino/menina) ou nome do bebê</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => openModalWithPlan(plano.id)}
                    className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      plano.popular
                        ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:from-pink-400 hover:via-purple-400 hover:to-blue-400 shadow-lg'
                        : 'bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <Baby className="w-5 h-5" />
                    Criar Música do Chá
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
              Mamães e papais que{' '}
              <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">amaram</span>
            </h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-pink-100 text-center"
              >
                <Quote className="w-12 h-12 text-pink-300 mx-auto mb-6" />
                <p className="text-lg sm:text-xl text-slate-700 mb-6 italic">
                  "{TESTIMONIALS_CHA[currentTestimonial].content}"
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="font-bold text-slate-800">{TESTIMONIALS_CHA[currentTestimonial].name}</p>
                <p className="text-sm text-pink-600">{TESTIMONIALS_CHA[currentTestimonial].role}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS_CHA.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentTestimonial ? 'w-8 bg-gradient-to-r from-pink-500 to-blue-500' : 'w-2 bg-pink-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
              Dúvidas frequentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS_CHA.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br from-pink-50 to-blue-50 border-2 rounded-2xl overflow-hidden transition-all ${
                  openFaq === index ? 'border-pink-300' : 'border-pink-100'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-slate-800 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-pink-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p className="px-5 pb-5 text-slate-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Baby className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              Menino ou menina?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Crie agora a música que vai emocionar toda a família no momento mais especial da revelação!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-10 py-5 bg-white text-purple-600 text-lg font-black rounded-full hover:bg-purple-50 transition-all shadow-2xl hover:-translate-y-1 inline-flex items-center gap-3"
            >
              <Wand2 className="w-6 h-6" />
              Criar Minha Música
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer simples */}
      <footer className="py-10 bg-slate-900 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold">Melodia Rara</span>
        </div>
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Melodia Rara. Todos os direitos reservados.
        </p>
        <a href="/" className="text-pink-400 text-sm hover:underline mt-2 inline-block">
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
          preSelectedOccasion="cha-revelacao"
          preSelectedRelationship="cha-bebe"
        />
      </CheckoutModal>
    </main>
  );
}
