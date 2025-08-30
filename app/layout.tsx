import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JUNIOR Peças, Acessórios e Serviços - Oficina Automotiva',
  description: 'Oficina automotiva especializada em manutenção, peças e acessórios. Há mais de 15 anos cuidando do seu veículo com qualidade e confiança.',
  keywords: 'oficina, automotiva, manutenção, peças, acessórios, mecânica, São Paulo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}