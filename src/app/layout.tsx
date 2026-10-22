import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavigationHeader, Footer } from '@/components/Navbar';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Learn in Your Way | Inclusive AI-Powered Education',
  description: 'One lesson, multiple accessible learning experiences. Supporting students with diverse visual, reading, linguistic, and cognitive learning preferences.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <head>
        {/* Direct link stylesheet to guarantee styling in all browser environments */}
        <link rel="stylesheet" href="/tailwind.css" />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col text-slate-900 bg-slate-50`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
        >
          Skip to main educational content
        </a>
        <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
          <NavigationHeader />
        </Suspense>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
