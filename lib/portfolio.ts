// Portfolio de músicas do Melodia Rara

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: "romantica" | "homenagem" | "especial";
  categoryLabel: string;
  audioUrl: string;
  coverImage: string;
  duration: string;
  occasion?: string;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "1",
    title: "Amor que Transborda",
    description: "Música criada para celebrar 10 anos de casamento",
    category: "romantica",
    categoryLabel: "Romântica",
    audioUrl: "/audio/portfolio/musica-1.mp3",
    coverImage: "/images/portfolio/fones-cidade.jpg",
    duration: "3:24",
    occasion: "Bodas de Estanho"
  },
  {
    id: "2",
    title: "Presente de Deus",
    description: "Homenagem emocionante para chegada do bebê",
    category: "especial",
    categoryLabel: "Especial",
    audioUrl: "/audio/portfolio/musica-2.mp3",
    coverImage: "/images/portfolio/bebe-fogos.jpg",
    duration: "3:45",
    occasion: "Chá de Bebê"
  },
  {
    id: "3",
    title: "Para Sempre Juntos",
    description: "Pedido de casamento surpresa",
    category: "romantica",
    categoryLabel: "Romântica",
    audioUrl: "/audio/portfolio/musica-3.mp3",
    coverImage: "/images/portfolio/casal-carro.jpg",
    duration: "2:58",
    occasion: "Pedido de Casamento"
  },
  {
    id: "4",
    title: "Minha Princesa",
    description: "Música para aniversário de 15 anos",
    category: "especial",
    categoryLabel: "Especial",
    audioUrl: "/audio/portfolio/musica-4.mp3",
    coverImage: "/images/portfolio/aniversario-bolo.jpg",
    duration: "3:12",
    occasion: "15 Anos"
  },
  {
    id: "5",
    title: "Nossa História",
    description: "Presente de aniversário de namoro",
    category: "romantica",
    categoryLabel: "Romântica",
    audioUrl: "/audio/portfolio/musica-5.mp3",
    coverImage: "/images/portfolio/cafe-cama.jpg",
    duration: "3:30",
    occasion: "Aniversário de Namoro"
  },
  {
    id: "6",
    title: "Maria Cecília",
    description: "Homenagem para uma filha especial",
    category: "homenagem",
    categoryLabel: "Homenagem",
    audioUrl: "/audio/portfolio/musica-6.mp3",
    coverImage: "/images/portfolio/maos-alianca.jpg",
    duration: "3:00",
    occasion: "Aniversário"
  },
];

export const PORTFOLIO_CATEGORIES = [
  { id: "all", label: "Todas" },
  { id: "romantica", label: "Românticas" },
  { id: "homenagem", label: "Homenagens" },
  { id: "especial", label: "Ocasiões Especiais" }
];
