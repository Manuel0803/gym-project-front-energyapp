import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/common/components/layout/ThemeProvider';
import TanStackQueryProvider from '@/core/providers/TanStackQueryProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://gymsystem-pro.vercel.app'
  ),
  title: {
    template: '%s | EnergyAPP',
    default: 'EnergyAPP - Terminal de Administradores',
  },
  description:
    'Terminal de gestión y administración para centros de entrenamiento.',
  openGraph: {
    title: 'EnergyAPP - Terminal de Administradores',
    description: 'Plataforma integral de gestión para tu gimnasio.',
    siteName: 'EnergyAPP',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen`}>
        <TanStackQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '100px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow:
                    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--success-main)',
                    secondary: 'var(--surface)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--danger-main)',
                    secondary: 'var(--surface)',
                  },
                },
              }}
            />
            {children}
          </ThemeProvider>
        </TanStackQueryProvider>
      </body>
    </html>
  );
}
