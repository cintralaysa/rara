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
    title: "Minha Princesa",
    description: "Musica emocionante para festa de 15 anos",
    category: "especial",
    categoryLabel: "Especial",
    audioUrl: "/audio/portfolio/musica-1.mp3",
    coverImage: "/images/portfolio/15-anos.png",
    duration: "3:24",
    occasion: "15 Anos"
  },
  {
    id: "2",
    title: "Amor Eterno",
    description: "Musica romantica para casamento dos sonhos",
    category: "romantica",
    categoryLabel: "Romantica",
    audioUrl: "/audio/portfolio/musica-2.mp3",
    coverImage: "/images/portfolio/casamento.png",
    duration: "3:45",
    occasion: "Casamento"
  },
  {
    id: "3",
    title: "Meu Pequeno Tesouro",
    description: "Homenagem carinhosa para aniversario infantil",
    category: "especial",
    categoryLabel: "Especial",
    audioUrl: "/audio/portfolio/musica-3.mp3",
    coverImage: "/images/portfolio/infantil.png",
    duration: "2:58",
    occasion: "Aniversario Infantil"
  },
  {
    id: "4",
    title: "Bem-vinda Princesa",
    description: "Musica especial para cha de revelacao",
    category: "especial",
    categoryLabel: "Especial",
    audioUrl: "/audio/portfolio/musica-4.mp3",
    coverImage: "/images/portfolio/cha-revelacao.png",
    duration: "3:12",
    occasion: "Cha Revelacao"
  },
];

export const PORTFOLIO_CATEGORIES = [
  { id: "all", label: "Todas" },
  { id: "romantica", label: "Românticas" },
  { id: "homenagem", label: "Homenagens" },
  { id: "especial", label: "Ocasiões Especiais" }
];
