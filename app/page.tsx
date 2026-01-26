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
    <main className="min-h-screen overflow-hidden bg-white">
      {/* Header - Clean & Minimal */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black flex items-center justify-center">
                <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900">
                Melodia Rara
              </span>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {['Como Funciona', 'Portfolio', 'Depoimentos', 'FAQ'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Criar Música
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Bold & Modern */}
      <section className="relative min-h-screen flex items-center pt-16 sm:pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gray-200/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gray-100 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-gray-600 text-xs sm:text-sm font-medium">Músicas 100% personalizadas</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
                Transforme sua
                <br />
                <span className="text-gray-400">história em música</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                Criamos músicas exclusivas e personalizadas para eternizar seus momentos mais especiais.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  Criar minha música
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Ouvir exemplos
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-10">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">+5.000</p>
                  <p className="text-gray-500 text-sm">clientes felizes</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">100%</p>
                  <p className="text-gray-500 text-sm">exclusiva</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">48h</p>
                  <p className="text-gray-500 text-sm">entrega rápida</p>
                </div>
              </div>
            </motion.div>

            {/* Visual - Modern Card Stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main visual card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Sua música exclusiva</p>
                      <p className="text-gray-400 text-sm">Personalizada para você</p>
                    </div>
                  </div>

                  {/* Waveform visualization */}
                  <div className="flex items-end justify-center gap-1 h-32 mb-6">
                    {[...Array(24)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 bg-white/80 rounded-full"
                        animate={{
                          height: [20, 40 + Math.random() * 60, 20],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-white/60 text-sm">
                    <span>0:00</span>
                    <span>3:45</span>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm font-medium">"Perfeito!"</p>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-sm font-medium">Entrega rápida</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </section>

      {/* Planos Section - Clean Cards */}
      <section id="planos" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Planos</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Escolha seu plano
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Preços exclusivos do site. Crie uma música única para eternizar seu momento especial.
            </p>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {PLANOS.map((plano, index) => (
              <motion.div
                key={plano.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl p-6 sm:p-8 ${
                  plano.popular
                    ? 'ring-2 ring-gray-900 shadow-xl'
                    : 'border border-gray-200 shadow-sm hover:shadow-lg'
                } transition-shadow`}
              >
                {/* Popular badge */}
                {plano.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gray-900 text-white text-xs font-medium px-4 py-1.5 rounded-full">
                      Mais popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plano.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                      R${Math.floor(plano.price)}
                    </span>
                    <span className="text-xl text-gray-500">,{String(plano.price).split('.')[1] || '00'}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Entrega em {plano.entrega}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plano.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openModalWithPlan(plano.id)}
                  className={`w-full py-3.5 rounded-full font-semibold transition-colors ${
                    plano.popular
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Escolher plano
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Como funciona</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simples e rápido
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Em apenas 3 passos você cria uma música exclusiva e emocionante
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <MessageCircle className="w-6 h-6" />,
                title: 'Conte sua história',
                description: 'Preencha o formulário com detalhes sobre a pessoa especial e o momento que deseja eternizar.'
              },
              {
                step: '02',
                icon: <Edit3 className="w-6 h-6" />,
                title: 'Criamos a letra',
                description: 'Nossa equipe cria uma letra personalizada e exclusiva baseada na sua história.'
              },
              {
                step: '03',
                icon: <Headphones className="w-6 h-6" />,
                title: 'Receba sua música',
                description: 'Você recebe sua música exclusiva produzida profissionalmente em alta qualidade.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-5xl font-bold text-gray-200">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              Começar agora
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Depoimentos Section */}
      <section id="depoimentos" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Depoimentos</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              O que dizem nossos clientes
            </h2>
          </motion.div>

          {/* Testimonial */}
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-3xl p-8 sm:p-12 text-center"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-xl sm:text-2xl text-gray-700 mb-8 leading-relaxed">
                  "{TESTIMONIALS[currentTestimonial].content}"
                </p>

                <div>
                  <p className="font-semibold text-gray-900">{TESTIMONIALS[currentTestimonial].name}</p>
                  <p className="text-gray-500 text-sm">{TESTIMONIALS[currentTestimonial].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-gray-900 w-6' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Perguntas frequentes
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
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
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para criar sua música?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Eternize seu momento especial com uma música única e exclusiva, feita especialmente para você.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-white text-gray-900 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Criar minha música
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Melodia Rara</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-sm">
                Transformamos suas histórias em músicas exclusivas e emocionantes.
              </p>
              <div className="flex gap-4">
                <a
                  href={`https://instagram.com/${COMPANY_INFO.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={`https://youtube.com/${COMPANY_INFO.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Navegação</h4>
              <ul className="space-y-3">
                {['Como Funciona', 'Portfolio', 'Depoimentos', 'FAQ'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contato</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail className="w-4 h-4" />
                  {COMPANY_INFO.email}
                </li>
                <li className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {COMPANY_INFO.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all z-50"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SimpleBookingForm onClose={() => setIsModalOpen(false)} selectedPlanId={selectedPlan} />
      </CheckoutModal>
    </main>
  );
}
