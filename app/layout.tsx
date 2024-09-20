import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'HabitTrack',
  description: 'A habit tracker with monthly progress visualization',
  keywords: ['habit tracker', 'monthly progress', 'visualization'],
  openGraph: {
    title: 'HabitTrack',
    description: 'A habit tracker with monthly progress visualization',
    images: ['/og-image.png'],
    type: 'website',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
