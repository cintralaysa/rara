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
        <meta name="facebook-domain-verification" content="3ldzfwvey6d7j8ebmtj0u5z5d37t2d" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1582887399617727');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1582887399617727&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
