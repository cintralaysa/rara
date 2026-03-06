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
    answer: "É tudo automático! Após o pagamento, você preenche os detalhes sobre a pessoa homenageada, a IA gera a letra personalizada, você aprova ou edita, e em 5 minutos suas melodias ficam prontas para ouvir e baixar."
  },
  {
    question: "Quanto tempo leva para receber a música?",
    answer: "Apenas 5 minutos! Após o pagamento, a letra é gerada automaticamente, você aprova ou edita, e suas melodias são criadas na hora. Você recebe por email e pode acessar direto no site com seu código exclusivo."
  },
  {
    question: "Como acesso minhas músicas depois?",
    answer: "Após a compra, você recebe um código de acesso por email (ex: CANTOS-AB12). Basta acessar nosso site e digitar o código na seção 'Já comprou?' para ouvir e baixar suas músicas a qualquer momento."
  },
  {
    question: "Posso pedir alterações na letra?",
    answer: "Sim! Você pode editar a letra gerada pela IA quantas vezes quiser antes de gerar as melodias. Queremos que a música fique exatamente como você imaginou."
  },
  {
    question: "O que está incluso no serviço?",
    answer: "No Plano Básico: 1 letra exclusiva + 2 melodias com ritmos diferentes. No Plano Premium: 2 letras exclusivas + 4 melodias. Tudo em MP3 alta qualidade, 100% seu."
  },
  {
    question: "A música é realmente exclusiva?",
    answer: "Absolutamente! Cada música é criada do zero com IA, especialmente para você. A composição, letra e produção são 100% originais e exclusivas. Você é o único dono dessa obra."
  },
  {
    question: "Posso escolher o estilo musical?",
    answer: "Sim! Você escolhe entre diversos estilos: pop, MPB, sertanejo, rock, romântico, e muito mais. Cada melodia é gerada com um ritmo diferente para você escolher a que mais combina."
  },
  {
    question: "Como é feito o pagamento?",
    answer: "Aceitamos PIX e cartão de crédito, de forma rápida e segura. Assim que o pagamento é confirmado, você já pode começar a criar sua música."
  },
  {
    question: "E se eu não gostar do resultado final?",
    answer: "Você pode editar a letra antes de gerar as melodias. Se mesmo assim não ficar satisfeito, devolvemos seu dinheiro. Sua satisfação é nossa prioridade."
  }
];

export const COMPANY_INFO = {
  name: "Melodia Rara",
  tagline: "Sua emoção vira melodia em 5 minutos",
  description: "Criador de músicas personalizadas com IA. Conte sua história, aprove a letra e receba suas melodias exclusivas em apenas 5 minutos direto no site e por email.",
  email: "contato@melodiarara.com.br",
  instagram: "@melodiarara",
  instagramUrl: "https://instagram.com/melodiarara",
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
    melodias: 2,
    entrega: "em 5 minutos",
    features: [
      "1 letra exclusiva personalizada",
      "2 melodias com ritmos diferentes",
      "Edite a letra no site",
      "Entrega em 5 minutos",
      "2 arquivos MP3 alta qualidade",
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
    melodias: 4,
    entrega: "em 5 minutos",
    features: [
      "2 letras exclusivas personalizadas",
      "4 melodias com ritmos diferentes",
      "Edite as letras no site",
      "Entrega em 5 minutos ⚡",
      "4 arquivos MP3 alta qualidade",
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
