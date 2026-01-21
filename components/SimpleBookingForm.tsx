'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Heart,
  Music,
  Sparkles,
  Check,
  Shield,
  Clock,
  RefreshCw,
  Edit3,
  X,
  User,
  Phone,
  Mail,
  Users,
  Mic2,
  CheckCircle,
  Gift,
  Baby
} from 'lucide-react';
import { PLANOS, getPlanoById, COMPANY_INFO } from '@/lib/data';

// Opcoes de relacionamento - Cha de Bebe primeiro!
const RELATIONSHIPS = [
  { value: 'cha-bebe', label: 'Cha de Bebe / Revelacao', emoji: '👶' },
  { value: 'esposo', label: 'Esposo(a)', emoji: '💑' },
  { value: 'namorado', label: 'Namorado(a)', emoji: '💕' },
  { value: 'mae', label: 'Mae', emoji: '👩' },
  { value: 'pai', label: 'Pai', emoji: '👨' },
  { value: 'filho', label: 'Filho(a)', emoji: '👧' },
  { value: 'avo', label: 'Avo/Avo', emoji: '👴' },
  { value: 'irmao', label: 'Irmao(a)', emoji: '👫' },
  { value: 'amigo', label: 'Amigo(a)', emoji: '🤝' },
  { value: 'outro', label: 'Outro', emoji: '✨' },
];

// Ocasioes
const OCCASIONS = [
  { value: 'aniversario', label: 'Aniversario', emoji: '🎂' },
  { value: 'casamento', label: 'Casamento', emoji: '💒' },
  { value: 'cha-revelacao', label: 'Cha Revelacao', emoji: '🎀' },
  { value: 'cha-bebe', label: 'Cha de Bebe', emoji: '👶' },
  { value: 'namoro', label: 'Dia dos Namorados', emoji: '💝' },
  { value: 'maes', label: 'Dia das Maes', emoji: '🌸' },
  { value: 'pais', label: 'Dia dos Pais', emoji: '👔' },
  { value: 'formatura', label: 'Formatura', emoji: '🎓' },
  { value: 'homenagem', label: 'Homenagem', emoji: '🏆' },
  { value: 'declaracao', label: 'Declaracao de Amor', emoji: '💌' },
  { value: 'pedido-casamento', label: 'Pedido de Casamento', emoji: '💍' },
  { value: 'outro', label: 'Outro', emoji: '🌟' },
];

// Estilos musicais
const MUSIC_STYLES = [
  { value: 'romantico', label: 'Romantico', emoji: '💕' },
  { value: 'sertanejo', label: 'Sertanejo', emoji: '🤠' },
  { value: 'mpb', label: 'MPB', emoji: '🎸' },
  { value: 'pop', label: 'Pop', emoji: '🎤' },
  { value: 'gospel', label: 'Gospel', emoji: '🙏' },
  { value: 'forro', label: 'Forro', emoji: '🪗' },
  { value: 'pagode', label: 'Pagode', emoji: '🥁' },
  { value: 'samba', label: 'Samba', emoji: '💃' },
  { value: 'rock', label: 'Rock', emoji: '🎸' },
  { value: 'bossa-nova', label: 'Bossa Nova', emoji: '🎹' },
  { value: 'infantil', label: 'Infantil', emoji: '🧸' },
  { value: 'classico', label: 'Classico', emoji: '🎻' },
];

interface FormData {
  relationship: string;
  honoreeName: string;
  occasion: string;
  musicStyle: string;
  musicStyle2: string; // Segundo estilo para Plano Premium
  voicePreference: string;
  storyAndMessage: string;
  familyNames: string;
  userName: string;
  whatsapp: string;
  email: string;
  knowsBabySex: string;
  babySex: string;
  babyNameBoy: string;
  babyNameGirl: string;
  generatedLyrics: string;
  lyricsApproved: boolean;
}

interface SimpleBookingFormProps {
  onClose?: () => void;
  selectedPlanId?: string;
  preSelectedOccasion?: string;
  preSelectedRelationship?: string;
}

export default function SimpleBookingForm({
  onClose,
  selectedPlanId = 'basico',
  preSelectedOccasion = '',
  preSelectedRelationship = ''
}: SimpleBookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatingLyrics, setGeneratingLyrics] = useState(false);
  const [lyricsError, setLyricsError] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState(selectedPlanId);
  const [showPlanUpgradeNotice, setShowPlanUpgradeNotice] = useState(false);

  // Obter plano atual (pode mudar dinamicamente)
  const plano = getPlanoById(currentPlanId) || PLANOS[0];

  const [formData, setFormData] = useState<FormData>({
    relationship: preSelectedRelationship,
    honoreeName: '',
    occasion: preSelectedOccasion,
    musicStyle: '',
    musicStyle2: '', // Segundo estilo para Plano Premium
    voicePreference: 'sem_preferencia',
    storyAndMessage: '',
    familyNames: '',
    userName: '',
    whatsapp: '',
    email: '',
    knowsBabySex: '',
    babySex: '',
    babyNameBoy: '',
    babyNameGirl: '',
    generatedLyrics: '',
    lyricsApproved: false,
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isChaBebe = formData.relationship === 'cha-bebe' || formData.occasion === 'cha-revelacao' || formData.occasion === 'cha-bebe';

  const canProceed = () => {
    switch (step) {
      case 1:
        if (isChaBebe) {
          if (!formData.knowsBabySex) return false;
          if (formData.knowsBabySex === 'sim' && !formData.babySex) return false;
          if (formData.knowsBabySex === 'sim' && formData.babySex === 'menino' && !formData.babyNameBoy.trim()) return false;
          if (formData.knowsBabySex === 'sim' && formData.babySex === 'menina' && !formData.babyNameGirl.trim()) return false;
          if (formData.knowsBabySex === 'nao' && (!formData.babyNameBoy.trim() || !formData.babyNameGirl.trim())) return false;
          return formData.honoreeName.trim().length >= 2 && formData.musicStyle;
        }
        return formData.relationship && formData.honoreeName.trim().length >= 2 && formData.occasion && formData.musicStyle;
      case 2:
        return formData.storyAndMessage.trim().length >= 20;
      case 3:
        return formData.lyricsApproved && formData.generatedLyrics.trim().length > 0;
      case 4:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return formData.userName.trim().length >= 2 && formData.whatsapp.trim().length >= 10 && emailRegex.test(formData.email.trim());
      default:
        return false;
    }
  };

  const generateLyrics = async () => {
    setGeneratingLyrics(true);
    setLyricsError('');
    try {
      const response = await fetch('/api/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationship: formData.relationship,
          relationshipLabel: RELATIONSHIPS.find(r => r.value === formData.relationship)?.label || formData.relationship,
          honoreeName: formData.honoreeName,
          occasion: formData.occasion,
          occasionLabel: OCCASIONS.find(o => o.value === formData.occasion)?.label || formData.occasion,
          musicStyle: formData.musicStyle,
          musicStyleLabel: MUSIC_STYLES.find(m => m.value === formData.musicStyle)?.label || formData.musicStyle,
          voicePreference: formData.voicePreference,
          qualities: formData.storyAndMessage,
          memories: formData.storyAndMessage,
          heartMessage: formData.storyAndMessage,
          familyNames: formData.familyNames,
          knowsBabySex: formData.knowsBabySex,
          babySex: formData.babySex,
          babyNameBoy: formData.babyNameBoy,
          babyNameGirl: formData.babyNameGirl,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setLyricsError(data.error);
      } else if (data.lyrics) {
        updateField('generatedLyrics', data.lyrics);
        updateField('lyricsApproved', false);
      }
    } catch (error: any) {
      console.error('Erro ao gerar letra:', error);
      setLyricsError('Erro de conexao. Verifique sua internet e tente novamente.');
    } finally {
      setGeneratingLyrics(false);
    }
  };

  const nextStep = async () => {
    if (step < totalSteps && canProceed()) {
      if (step === 2 && !formData.generatedLyrics) {
        await generateLyrics();
      }
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Redirecionar para checkout PIX interno
  const handlePixCheckout = async () => {
    if (!canProceed()) return;
    setLoading(true);
    setPaymentError(null);

    try {
      // Preparar dados do pedido
      const orderData = {
        userName: formData.userName,
        email: formData.email,
        whatsapp: formData.whatsapp,
        honoreeName: formData.honoreeName,
        relationship: formData.relationship,
        relationshipLabel: RELATIONSHIPS.find(r => r.value === formData.relationship)?.label,
        occasion: formData.occasion,
        occasionLabel: OCCASIONS.find(o => o.value === formData.occasion)?.label,
        musicStyle: formData.musicStyle,
        musicStyleLabel: MUSIC_STYLES.find(m => m.value === formData.musicStyle)?.label,
        musicStyle2: formData.musicStyle2 || formData.musicStyle, // Se nao escolheu segundo estilo, usa o primeiro
        musicStyle2Label: formData.musicStyle2
          ? MUSIC_STYLES.find(m => m.value === formData.musicStyle2)?.label
          : MUSIC_STYLES.find(m => m.value === formData.musicStyle)?.label,
        voicePreference: formData.voicePreference,
        storyAndMessage: formData.storyAndMessage,
        familyNames: formData.familyNames,
        generatedLyrics: formData.generatedLyrics,
        knowsBabySex: formData.knowsBabySex,
        babySex: formData.babySex,
        babyNameBoy: formData.babyNameBoy,
        babyNameGirl: formData.babyNameGirl,
        // Informacoes do plano
        planoId: plano.id,
        planoNome: plano.name,
        planoPreco: plano.price,
        planoPrecoCents: plano.priceCents,
        planoMelodias: plano.melodias,
        planoEntrega: plano.entrega,
      };

      // Salvar dados no localStorage para a pagina de checkout
      localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      // Redirecionar para pagina de checkout PIX
      router.push('/checkout/pix');
    } catch (error: any) {
      setPaymentError(error.message || 'Erro ao processar. Tente novamente.');
      setLoading(false);
    }
  };

  const stepInfo = [
    { title: 'Informacoes da Musica', desc: 'Para quem e a musica?' },
    { title: 'Sua Historia', desc: 'Conte sobre essa pessoa especial' },
    { title: 'Sua Letra', desc: 'Veja e aprove a letra criada' },
    { title: 'Seus Dados', desc: 'Para recebermos o pagamento' },
  ];

  return (
    <div className="bg-white rounded-none sm:rounded-2xl max-h-[100vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-slate-900 px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                Passo {step} de {totalSteps}
              </span>
            </div>
            <h3 className="text-sm sm:text-lg font-bold truncate">{stepInfo[step - 1].title}</h3>
            <p className="text-blue-200/70 text-[10px] sm:text-xs truncate">{stepInfo[step - 1].desc}</p>
          </div>
          <div className="text-right flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Preço visível */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-green-500/30">
              <span className="text-[10px] sm:text-xs text-green-300 font-medium block">Plano {plano.name}</span>
              <span className="text-base sm:text-lg font-black text-white">R$ {plano.price.toFixed(2).replace('.', ',')}</span>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-lg">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            )}
          </div>
        </div>
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Conteudo */}
      <div className="p-4 overflow-y-auto flex-1">
        <AnimatePresence mode="wait">
          {/* PASSO 1 - Informacoes da Musica */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Explicação do processo */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-blue-800">
                  <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-blue-200">
                    <Edit3 size={12} className="text-blue-500" />
                    Crie a letra
                  </span>
                  <ArrowRight size={12} className="text-blue-400" />
                  <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-blue-200">
                    <RefreshCw size={12} className="text-amber-500" />
                    Edite a vontade
                  </span>
                  <ArrowRight size={12} className="text-blue-400" />
                  <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-blue-200">
                    <Phone size={12} className="text-green-500" />
                    Receba no WhatsApp
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Heart size={16} className="text-amber-500" />
                  Para quem e essa musica?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {RELATIONSHIPS.map((rel) => (
                    <button key={rel.value} type="button"
                      onClick={() => {
                        updateField('relationship', rel.value);
                        if (rel.value === 'cha-bebe') {
                          updateField('occasion', 'cha-revelacao');
                        } else if (formData.occasion === 'cha-revelacao' || formData.occasion === 'cha-bebe') {
                          updateField('occasion', '');
                        }
                      }}
                      className={`p-2 rounded-xl border-2 text-center transition-all active:scale-95 ${
                        formData.relationship === rel.value
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}>
                      <span className="text-lg block">{rel.emoji}</span>
                      <span className={`font-medium text-[10px] sm:text-[8px] block mt-1 leading-tight ${
                        formData.relationship === rel.value ? 'text-blue-600' : 'text-slate-600'
                      }`}>{rel.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Secao Cha de Bebe/Revelacao */}
              {isChaBebe && (
                <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-4 border border-pink-200 space-y-4">
                  <div className="text-center">
                    <Baby className="w-8 h-8 text-pink-500 mx-auto mb-1" />
                    <h3 className="text-sm font-bold text-slate-900">Detalhes do Cha de Bebe</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Voce ja sabe o sexo do bebe?</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button"
                        onClick={() => {
                          updateField('knowsBabySex', 'sim');
                          updateField('babySex', '');
                          // Se tinha sido forçado para Premium, volta para o plano original
                          if (showPlanUpgradeNotice) {
                            setCurrentPlanId(selectedPlanId);
                            setShowPlanUpgradeNotice(false);
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          formData.knowsBabySex === 'sim' ? 'border-pink-500 bg-pink-100' : 'border-slate-200'
                        }`}>
                        <span className="text-lg block">✅</span>
                        <span className="font-bold text-xs">Sim, ja sei!</span>
                      </button>
                      <button type="button"
                        onClick={() => {
                          updateField('knowsBabySex', 'nao');
                          updateField('babySex', '');
                          // Forca plano Premium pois precisa de 2 melodias (menino e menina)
                          if (currentPlanId === 'basico') {
                            setCurrentPlanId('premium');
                            setShowPlanUpgradeNotice(true);
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          formData.knowsBabySex === 'nao' ? 'border-blue-500 bg-blue-100' : 'border-slate-200'
                        }`}>
                        <span className="text-lg block">🎁</span>
                        <span className="font-bold text-xs">E surpresa!</span>
                      </button>
                    </div>
                  </div>

                  {formData.knowsBabySex === 'sim' && (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700">Qual o sexo?</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button"
                          onClick={() => { updateField('babySex', 'menino'); updateField('babyNameGirl', ''); }}
                          className={`p-3 rounded-xl border-2 ${
                            formData.babySex === 'menino' ? 'border-blue-500 bg-blue-100' : 'border-slate-200'
                          }`}>
                          <span className="text-xl">💙</span>
                          <span className="font-bold text-xs block">Menino</span>
                        </button>
                        <button type="button"
                          onClick={() => { updateField('babySex', 'menina'); updateField('babyNameBoy', ''); }}
                          className={`p-3 rounded-xl border-2 ${
                            formData.babySex === 'menina' ? 'border-pink-500 bg-pink-100' : 'border-slate-200'
                          }`}>
                          <span className="text-xl">💖</span>
                          <span className="font-bold text-xs block">Menina</span>
                        </button>
                      </div>
                      {formData.babySex && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nome do bebe</label>
                          <input
                            type="text"
                            value={formData.babySex === 'menino' ? formData.babyNameBoy : formData.babyNameGirl}
                            onChange={(e) => updateField(formData.babySex === 'menino' ? 'babyNameBoy' : 'babyNameGirl', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 text-sm"
                            placeholder={`Nome do ${formData.babySex}`}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {formData.knowsBabySex === 'nao' && (
                    <div className="space-y-3">
                      {/* Aviso de upgrade de plano */}
                      {showPlanUpgradeNotice && (
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-3 animate-pulse">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-amber-800">Plano atualizado para Premium!</p>
                              <p className="text-xs text-amber-700 mt-1">
                                Como o sexo e surpresa, precisamos criar 2 melodias diferentes (uma para menino e outra para menina). Seu plano foi automaticamente atualizado.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-blue-700 bg-blue-100 p-2 rounded-lg">
                        Criaremos uma musica com suspense e dois finais! Um para menino e outro para menina.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-blue-600 mb-1">💙 Se for menino</label>
                          <input
                            type="text"
                            value={formData.babyNameBoy}
                            onChange={(e) => updateField('babyNameBoy', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border-2 border-blue-200 focus:border-blue-500 text-sm"
                            placeholder="Nome do menino"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-pink-600 mb-1">💖 Se for menina</label>
                          <input
                            type="text"
                            value={formData.babyNameGirl}
                            onChange={(e) => updateField('babyNameGirl', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-500 text-sm"
                            placeholder="Nome da menina"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <User size={16} className="text-amber-500" />
                  {isChaBebe ? 'Nome dos pais' : 'Nome da pessoa homenageada'}
                </label>
                <input
                  type="text"
                  value={formData.honoreeName}
                  onChange={(e) => updateField('honoreeName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 text-base"
                  placeholder={isChaBebe ? "Ex: Maria e Joao" : "Ex: Maria"}
                />
              </div>

              {!isChaBebe && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Gift size={16} className="text-amber-500" />
                    Qual a ocasiao especial?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {OCCASIONS.filter(o => o.value !== 'cha-revelacao' && o.value !== 'cha-bebe').map((occ) => (
                      <button key={occ.value} type="button"
                        onClick={() => updateField('occasion', occ.value)}
                        className={`p-2 rounded-xl border-2 text-center active:scale-95 transition-all ${
                          formData.occasion === occ.value
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}>
                        <span className="text-lg block">{occ.emoji}</span>
                        <span className={`font-medium text-[10px] sm:text-[8px] block mt-1 leading-tight ${
                          formData.occasion === occ.value ? 'text-blue-600' : 'text-slate-600'
                        }`}>{occ.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Music size={16} className="text-amber-500" />
                  {plano.melodias > 1 ? 'Estilo da 1ª melodia' : 'Qual estilo musical?'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {MUSIC_STYLES.map((style) => (
                    <button key={style.value} type="button"
                      onClick={() => updateField('musicStyle', style.value)}
                      className={`p-2 rounded-xl border-2 text-center active:scale-95 transition-all ${
                        formData.musicStyle === style.value
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}>
                      <span className="text-lg block">{style.emoji}</span>
                      <span className={`font-medium text-[10px] sm:text-[8px] block mt-1 leading-tight ${
                        formData.musicStyle === style.value ? 'text-blue-600' : 'text-slate-600'
                      }`}>{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Segundo estilo musical - apenas para Plano Premium */}
              {plano.melodias > 1 && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-200">
                  <label className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-2">
                    <Sparkles size={14} className="text-amber-500" />
                    Bonus Premium: Escolha o estilo da 2ª melodia
                  </label>
                  <select
                    value={formData.musicStyle2 || ''}
                    onChange={(e) => updateField('musicStyle2', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-amber-200 bg-white text-sm font-medium text-slate-700 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">Mesmo estilo da 1ª melodia</option>
                    {MUSIC_STYLES.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.emoji} {style.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Mic2 size={16} className="text-amber-500" />
                  Qual voz voce prefere?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button"
                    onClick={() => updateField('voicePreference', 'feminina')}
                    className={`p-2 rounded-xl border-2 text-center active:scale-95 transition-all ${
                      formData.voicePreference === 'feminina'
                        ? 'border-pink-500 bg-pink-50 shadow-md'
                        : 'border-slate-200'
                    }`}>
                    <span className="text-xl block">👩‍🎤</span>
                    <span className={`font-bold text-xs block mt-1 ${
                      formData.voicePreference === 'feminina' ? 'text-pink-600' : 'text-slate-600'
                    }`}>Feminina</span>
                  </button>
                  <button type="button"
                    onClick={() => updateField('voicePreference', 'masculina')}
                    className={`p-2 rounded-xl border-2 text-center active:scale-95 transition-all ${
                      formData.voicePreference === 'masculina'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-slate-200'
                    }`}>
                    <span className="text-xl block">👨‍🎤</span>
                    <span className={`font-bold text-xs block mt-1 ${
                      formData.voicePreference === 'masculina' ? 'text-blue-600' : 'text-slate-600'
                    }`}>Masculina</span>
                  </button>
                  <button type="button"
                    onClick={() => updateField('voicePreference', 'sem_preferencia')}
                    className={`p-2 rounded-xl border-2 text-center active:scale-95 transition-all ${
                      formData.voicePreference === 'sem_preferencia'
                        ? 'border-amber-500 bg-amber-50 shadow-md'
                        : 'border-slate-200'
                    }`}>
                    <span className="text-xl block">🎵</span>
                    <span className={`font-bold text-xs block mt-1 ${
                      formData.voicePreference === 'sem_preferencia' ? 'text-amber-600' : 'text-slate-600'
                    }`}>Tanto faz</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* PASSO 2 - Historia */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3 border border-blue-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex items-center justify-center text-white text-lg">
                  {RELATIONSHIPS.find(r => r.value === formData.relationship)?.emoji || '🎵'}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{formData.honoreeName}</p>
                  <p className="text-xs text-slate-500">
                    {OCCASIONS.find(o => o.value === formData.occasion)?.label} • {MUSIC_STYLES.find(m => m.value === formData.musicStyle)?.label}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Heart size={16} className="text-amber-500 fill-amber-500" />
                  Conte a historia de {formData.honoreeName}
                </label>
                <p className="text-xs text-slate-500">Quanto mais detalhes, mais especial ficara a musica!</p>
                <textarea
                  value={formData.storyAndMessage}
                  onChange={(e) => updateField('storyAndMessage', e.target.value)}
                  rows={6}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 resize-none text-sm"
                  placeholder="Conte qualidades, memorias especiais, momentos marcantes, apelidos carinhosos, lugares que frequentam juntos..."
                />
                <div className="flex justify-between items-start">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex-1 mr-2">
                    <p className="text-xs text-amber-700">
                      <strong>Dicas:</strong> Como se conheceram, momentos inesqueciveis, caracteristicas que voce ama...
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${formData.storyAndMessage.length < 20 ? 'text-red-500' : 'text-green-500'}`}>
                    {formData.storyAndMessage.length}/1000
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Users size={16} className="text-amber-500" />
                  Familiares para mencionar <span className="text-slate-400 font-normal text-xs">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={formData.familyNames}
                  onChange={(e) => updateField('familyNames', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 text-sm"
                  placeholder="Ex: Joao (pai), Maria (mae), Pedro (filho)"
                />
              </div>
            </motion.div>
          )}

          {/* PASSO 3 - Letra */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {generatingLyrics ? (
                <div className="text-center py-8">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <Music className="text-blue-600 animate-bounce" size={28} />
                    </div>
                    <span className="absolute -top-2 -right-2 text-2xl animate-bounce">🎵</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Criando a letra para {formData.honoreeName}...</h3>
                  <p className="text-blue-600 font-medium mb-4">Estamos gerando sua letra para aprovacao</p>
                  <div className="bg-blue-50 rounded-xl p-4 max-w-sm mx-auto border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                      <p className="text-sm text-slate-700">Nossa IA esta compondo versos unicos...</p>
                    </div>
                  </div>
                </div>
              ) : lyricsError ? (
                <div className="text-center py-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <p className="text-red-600 text-sm">{lyricsError}</p>
                  </div>
                  <button type="button" onClick={generateLyrics} className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700">
                    <RefreshCw size={16} />
                    Tentar Novamente
                  </button>
                </div>
              ) : formData.generatedLyrics ? (
                <>
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Music size={18} className="text-blue-600" />
                        <span className="font-bold text-slate-900 text-sm">Letra para {formData.honoreeName}</span>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                        {MUSIC_STYLES.find(m => m.value === formData.musicStyle)?.label}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-4 max-h-[200px] overflow-y-auto shadow-inner border">
                      <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed">{formData.generatedLyrics}</pre>
                    </div>
                  </div>

                  {/* Aviso de edição ilimitada */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                    <Sparkles size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      <strong>Edite quantas vezes quiser!</strong> Gere novas versoes ou edite manualmente ate ficar perfeita.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={generateLyrics} disabled={generatingLyrics}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-300 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50">
                      <RefreshCw size={16} />
                      Nova Versao
                    </button>
                    <button type="button" onClick={() => updateField('lyricsApproved', true)} disabled={formData.lyricsApproved}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                        formData.lyricsApproved
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                      }`}>
                      <Check size={16} />
                      {formData.lyricsApproved ? 'Aprovada!' : 'Aprovar Letra'}
                    </button>
                  </div>

                  {formData.lyricsApproved && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-green-700 text-sm font-medium flex items-center justify-center gap-2">
                        <Check size={16} />
                        Letra aprovada! Clique em Proximo para continuar.
                      </p>
                    </div>
                  )}

                  <details className="border border-slate-200 rounded-xl overflow-hidden">
                    <summary className="px-4 py-3 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50 flex items-center gap-2">
                      <Edit3 size={14} />
                      Editar letra manualmente
                    </summary>
                    <div className="p-4 pt-0 border-t">
                      <textarea
                        value={formData.generatedLyrics}
                        onChange={(e) => { updateField('generatedLyrics', e.target.value); updateField('lyricsApproved', false); }}
                        rows={10}
                        className="w-full px-3 py-2 rounded-lg border text-sm font-mono resize-none"
                      />
                    </div>
                  </details>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-blue-600" size={32} />
                  </div>
                  <p className="text-slate-600 mb-4">Clique para gerar sua letra personalizada</p>
                  <button type="button" onClick={generateLyrics}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800">
                    <Sparkles size={18} />
                    Gerar Minha Letra
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* PASSO 4 - Dados Pessoais e Pagamento */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Destaque: Entrega no WhatsApp */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800 text-sm">Receba sua musica no WhatsApp!</h4>
                    <p className="text-xs text-green-700">
                      Entrega em ate <strong>{plano.entrega}</strong> direto no seu celular
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <User size={16} className="text-amber-500" />
                    Seu nome
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => updateField('userName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 text-base"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Phone size={16} className="text-amber-500" />
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Mail size={16} className="text-amber-500" />
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Valor emocional */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Heart size={18} className="text-amber-500 fill-amber-500" />
                  Voce esta prestes a criar algo unico
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Music size={12} className="text-white" />
                    </div>
                    <p className="text-slate-700 text-sm">
                      Uma musica <strong>100% exclusiva</strong> para <strong>{formData.honoreeName}</strong>, que ninguem mais no mundo tera igual
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart size={12} className="text-white" />
                    </div>
                    <p className="text-slate-700 text-sm">
                      Um presente que vai <strong>emocionar de verdade</strong> e ficar guardado para sempre no coracao
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <p className="text-slate-700 text-sm">
                      Cada verso conta a <strong>historia de voces</strong>, transformada em melodia profissional
                    </p>
                  </div>
                </div>
              </div>

              {/* Botao de Finalizar - PIX */}
              {canProceed() && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <svg viewBox="0 0 512 512" className="w-5 h-5 fill-green-500"><path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.172 33.045 21.98 53.12 21.98h15.098l-97.138 97.139c-30.326 30.344-79.505 30.344-109.85 0l-97.415-97.416h9.232zm280.068-271.294c-20.056 0-38.929 7.809-53.12 22l-76.97 76.99c-5.551 5.53-14.6 5.568-20.15-.02l-76.711-76.693c-14.192-14.191-33.046-21.999-53.12-21.999h-9.234l97.416-97.416c30.344-30.344 79.523-30.344 109.867 0l97.138 97.138h-15.116z"/></svg>
                      Pagamento via PIX
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-green-700">
                      <Check size={16} className="text-green-500" />
                      <span>Pagamento instantaneo</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-green-700 mt-1">
                      <Check size={16} className="text-green-500" />
                      <span>Confirmacao automatica</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-green-700 mt-1">
                      <Check size={16} className="text-green-500" />
                      <span>Receba sua musica em ate {plano.entrega}</span>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{paymentError}</div>
                  )}

                  <button
                    type="button"
                    onClick={handlePixCheckout}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-500/30"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" />Processando...</>
                    ) : (
                      <>
                        <svg viewBox="0 0 512 512" className="w-6 h-6 fill-current"><path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.172 33.045 21.98 53.12 21.98h15.098l-97.138 97.139c-30.326 30.344-79.505 30.344-109.85 0l-97.415-97.416h9.232zm280.068-271.294c-20.056 0-38.929 7.809-53.12 22l-76.97 76.99c-5.551 5.53-14.6 5.568-20.15-.02l-76.711-76.693c-14.192-14.191-33.046-21.999-53.12-21.999h-9.234l97.416-97.416c30.344-30.344 79.523-30.344 109.867 0l97.138 97.138h-15.116z"/></svg>
                        Pagar com PIX - R$ {plano.price.toFixed(2).replace('.', ',')}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Pagamento seguro - QR Code gerado na proxima tela
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navegacao */}
        <div className="flex gap-3 pt-6">
          {step > 1 && (
            <button type="button" onClick={prevStep}
              className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-600 text-sm hover:bg-slate-50">
              <ArrowLeft size={16} />
              Voltar
            </button>
          )}
          {step < totalSteps && (
            <button type="button" onClick={nextStep} disabled={!canProceed() || generatingLyrics}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                canProceed() && !generatingLyrics
                  ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-amber-400 hover:from-blue-700 hover:to-blue-800 shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}>
              {generatingLyrics ? (
                <><Loader2 className="animate-spin" size={16} />Gerando...</>
              ) : (
                <>Proximo<ArrowRight size={16} /></>
              )}
            </button>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 pt-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Shield size={12} className="text-green-500" />
            <span>Seguro</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-blue-500" />
            <span>Entrega 48h</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={12} className="text-red-400" />
            <span>+5.000 clientes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
