import type { Metadata } from 'next';
import './globals.css';
import { VanishingDoseProvider } from '@/context/VanishingDoseContext';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Vanishing Dose — Closed-Loop Medication Recovery System',
  description: 'Detecting Medication Non-Adherence Without Asking, Reconstructing Why, and Verifying Restored Execution.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        <VanishingDoseProvider>
          <Navigation />
          <main>{children}</main>
        </VanishingDoseProvider>
      </body>
    </html>
  );
}
