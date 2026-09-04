import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Fixo - Directorio Local y Tarjeta Digital para Técnicos y Oficios en Chiapas',
  description: 'Conecta con técnicos verificados de plomería, electricidad, climas y más en Tuxtla Gutiérrez y Chiapas. Sin comisiones, directo por WhatsApp.',
  keywords: ['técnicos Tuxtla', 'plomero Tuxtla Gutiérrez', 'electricista Chiapas', 'minisplits clima', 'oficios Chiapas', 'tarjeta digital QR'],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    title: 'Fixo - La red de tus mejores chambas',
    description: 'Directorio local y tarjeta digital con QR para técnicos y oficios en Chiapas.',
    type: 'website',
    locale: 'es_MX',
    url: 'https://fixo.com.mx',
    siteName: 'Fixo',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-bg text-brand-base antialiased selection:bg-brand-primary selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
