import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css'; 
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Email.Pro | Production-Ready Templates',
  description: 'Precision email engineering environment for responsive, React-powered templates.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-neutral-300 bg-[#07080b] selection:bg-indigo-500/30 selection:text-white min-h-screen">
        <ErrorBoundary>
          {children}
          <Toaster position="top-right" expand={false} richColors />
        </ErrorBoundary>
      </body>
    </html>
  );
}
