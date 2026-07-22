import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SlideCart from '@/components/SlideCart';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wisdom Wear | Vista sua presença | E-Commerce Oficial',
  description:
    'Wisdom é uma marca de vestuário Lifestyle Premium. Luxo moderno acessível, peças minimalistas de alta qualidade, alfaiataria atemporal e silêncio sofisticado.',
  keywords: ['Wisdom Wear', 'Camisetas Premium', 'Silent Luxury', 'Moda Minimalista', 'Vestuário Masculino Premium'],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Wisdom Wear | Vista sua presença',
    description: 'Estilo que fala baixo e impacta alto. Coleção minimalista premium.',
    url: 'https://wisdomwear.com.br',
    siteName: 'Wisdom Wear',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <SlideCart />
      </body>
    </html>
  );
}
