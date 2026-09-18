import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css'; 
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/lib/theme-context';

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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`} data-theme="dark">
      <body className="font-sans antialiased text-fg bg-bg-app selection:bg-indigo-500/30 selection:text-white min-h-screen transition-colors duration-200">
        <ThemeProvider>
          <ErrorBoundary>
            {children}
            <Toaster position="top-right" expand={false} richColors />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
