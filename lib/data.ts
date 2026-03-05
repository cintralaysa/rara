// Dados do Melodia Rara - Músicas Personalizadas

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  highlight?: string;
  audioSample?: string;
  type: "music";
}

export const SERVICES: Service[] = [
  {
    id: "musica-romantica",
    slug: "musica-romantica",
    title: "Música Romântica",
    description: "Uma canção única que eterniza o amor de vocês. Perfeita para casamentos, aniversários de namoro, pedidos de casamento ou simplesmente para dizer 'eu te amo' de uma forma inesquecível.",
    price: 49.90,
    image: "/images/romantica.jpg",
    features: [
      "Letra exclusiva personalizada",
      "Melodia única e profissional",
      "Entrega em 5 minutos",
      "Revisões ilimitadas na letra",
      "Arquivo em alta qualidade (MP3)",
      "Edite a letra direto no site"
    ],
    highlight: "Mais vendida",
    audioSample: "/audio/sample-romantica.mp3",
    type: "music"
  },
  {
    id: "musica-homenagem",
    slug: "musica-homenagem",
    title: "Música de Homenagem",
    description: "Celebre a vida de alguém especial com uma música que conta sua história. Ideal para homenagear pais, avós, filhos ou amigos em momentos marcantes.",
    price: 49.90,
    image: "/images/homenagem.jpg",
    features: [
      "Letra exclusiva personalizada",
      "Melodia única e profissional",
      "Entrega em 5 minutos",
      "Revisões ilimitadas na letra",
      "Arquivo em alta qualidade (MP3)",
      "Edite a letra direto no site"
    ],
    audioSample: "/audio/sample-homenagem.mp3",
    type: "music"
  },
  {
    id: "musica-especial",
    slug: "musica-especial",
    title: "Música para Ocasião Especial",
    description: "Chá revelação, aniversário, dia das mães, dia dos pais, formatura... Qualquer momento especial merece uma música única e emocionante.",
    price: 49.90,
    image: "/images/especial.jpg",
    features: [
      "Letra exclusiva personalizada",
      "Melodia única e profissional",
      "Entrega em 5 minutos",
      "Revisões ilimitadas na letra",
      "Arquivo em alta qualidade (MP3)",
      "Edite a letra direto no site"
    ],
    audioSample: "/audio/sample-especial.mp3",
    type: "music"
  }
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  serviceType: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Mariana Silva",
    role: "Noiva",
    content: "A música que fizeram para nosso casamento foi o momento mais emocionante da cerimônia. Todos choraram! É uma lembrança que vamos carregar para sempre.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    serviceType: "Música Romântica"
  },
  {
    id: "2",
    name: "Carlos Eduardo",
    role: "Filho agradecido",
    content: "Encomendei uma música para os 70 anos da minha mãe. Quando ela ouviu, não conseguiu segurar as lágrimas. Foi o presente mais especial que já dei.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    serviceType: "Música de Homenagem"
  },
  {
    id: "3",
    name: "Fernanda Costa",
    role: "Esposa",
    content: "Meu marido me surpreendeu com uma música que conta nossa história de 15 anos. Cada verso me fez reviver nossos momentos. Simplesmente perfeito!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    serviceType: "Música Romântica"
  },
  {
    id: "4",
    name: "Roberto Almeida",
    role: "Pai emocionado",
    content: "Pedi uma música para a formatura da minha filha. Quando tocou no evento, não tinha um olho seco na sala. Valeu cada centavo e muito mais.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    serviceType: "Música de Homenagem"
  },
  {
    id: "5",
    name: "Ana Paula Santos",
    role: "Mãe",
    content: "Fiz uma música para o chá revelação do meu bebê. A emoção de toda a família foi indescritível. Um momento que ficou gravado pra sempre no coração de todos.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    serviceType: "Música Chá Revelação"
  }
];

export interface FAQ {
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    question: "Como funciona o processo de criação da música?",
    answer: "Após o pagamento, você preenche um formulário detalhado contando a história que quer eternizar. Nossa equipe de compositores cria a letra personalizada, você aprova ou solicita ajustes, e então produzimos a música completa com instrumentação profissional."
  },
  {
    question: "Quanto tempo leva para receber a música?",
    answer: "Sua música fica pronta em apenas 5 minutos! Após o pagamento, você gera a letra no site, aprova ou edita, e recebe direto no site sua melodia exclusiva profissionalmente produzida."
  },
  {
    question: "Posso pedir alterações na letra?",
    answer: "Sim! Oferecemos revisões ilimitadas na letra até você estar 100% satisfeito. Queremos que a música fique exatamente como você imaginou."
  },
  {
    question: "O que está incluso no serviço?",
    answer: "Você recebe uma música completa com letra exclusiva personalizada e melodia profissional, tudo em alta qualidade (MP3). É 100% sua, feita especialmente para o seu momento especial."
  },
  {
    question: "A música é realmente exclusiva?",
    answer: "Absolutamente! Cada música é criada do zero, especialmente para você. A composição, letra e produção são 100% originais e exclusivas. Você é o único dono dessa obra."
  },
  {
    question: "Posso escolher o estilo musical?",
    answer: "Sim! Você pode indicar suas preferências de estilo (pop, MPB, sertanejo, rock, etc.) e até enviar referências de músicas que gosta. Nossa equipe adapta a produção ao seu gosto."
  },
  {
    question: "Como é feito o pagamento?",
    answer: "O pagamento é feito via PIX, de forma rápida e segura. Assim que confirmamos o pagamento, iniciamos imediatamente o processo de criação."
  },
  {
    question: "E se eu não gostar do resultado final?",
    answer: "Trabalhamos com aprovação em etapas justamente para garantir sua satisfação. Primeiro você aprova a letra, depois a melodia. Se mesmo assim não ficar satisfeito, devolvemos seu dinheiro."
  }
];

export const COMPANY_INFO = {
  name: "Melodia Rara",
  tagline: "Transformamos sua história em música",
  description: "Criamos músicas personalizadas e únicas que eternizam seus momentos mais especiais. Cada composição é uma obra de arte exclusiva, feita especialmente para você.",
  email: "contato@melodiarara.com.br",
  instagram: "@melodiarara",
  youtube: "@melodiarara",
  address: "São Paulo, SP - Brasil"
};

// Planos de preço
export interface PricePlan {
  id: string;
  name: string;
  price: number; // em reais
  priceCents: number; // em centavos para API
  melodias: number;
  entrega: string;
  features: string[];
  highlight?: string;
  popular?: boolean;
}

export const PLANOS: PricePlan[] = [
  {
    id: "basico",
    name: "Plano Básico",
    price: 49.90,
    priceCents: 4990,
    melodias: 1,
    entrega: "em 5 minutos",
    features: [
      "1 letra exclusiva personalizada",
      "1 melodia completa",
      "Edite a letra no site",
      "Entrega em 5 minutos",
      "Arquivo MP3 alta qualidade",
      "Acesso direto no site"
    ],
    highlight: "Exclusivo do Site",
    popular: false
  },
  {
    id: "premium",
    name: "Plano Premium",
    price: 79.90,
    priceCents: 7990,
    melodias: 2,
    entrega: "em 5 minutos",
    features: [
      "1 letra exclusiva personalizada",
      "2 músicas com ritmos diferentes",
      "Edite a letra no site",
      "Entrega em 5 minutos ⚡",
      "2 arquivos MP3 alta qualidade",
      "Prioridade na produção",
      "Acesso direto no site"
    ],
    highlight: "Mais Vendido",
    popular: true
  }
];

// Funcao para obter plano por ID
export const getPlanoById = (id: string): PricePlan | undefined => {
  return PLANOS.find(p => p.id === id);
};

// Precos padrão (plano basico) - para compatibilidade
export const PRECO_MUSICA = 4990; // em centavos
export const PRECO_MUSICA_DISPLAY = 49.90; // em reais para exibicao
