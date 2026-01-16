import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://melodiarara.com'),
  title: 'Melodia Rara - Músicas Personalizadas',
  description: 'Transforme seus sentimentos em uma música única e emocionante. Crie uma canção personalizada para presentear quem você ama.',
  keywords: 'música personalizada, presente musical, canção exclusiva, homenagem musical, presente criativo',
  openGraph: {
    title: 'Melodia Rara - Músicas Personalizadas',
    description: 'Transforme seus sentimentos em uma música única e emocionante.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://melodiarara.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melodia Rara - Músicas Personalizadas',
    description: 'Transforme seus sentimentos em uma música única e emocionante.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
