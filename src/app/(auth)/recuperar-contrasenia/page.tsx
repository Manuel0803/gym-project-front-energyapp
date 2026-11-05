import { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | EnergyAPP',
  description: 'Solicita un enlace de recuperación para tu cuenta de EnergyAPP.',
};

export default function ForgotPasswordPage() {
  return (
    <main className="w-full max-w-100 flex flex-col items-center">
      <header className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full border border-border-primary bg-surface flex items-center justify-center mb-4 transition-colors">
          <Dumbbell aria-hidden="true" className="text-brand-main" size={24} />
        </div>
        <h1 className="text-xl font-bold text-text-main transition-colors">
          EnergyAPP
        </h1>
        <p className="text-sm text-text-muted mt-1 transition-colors text-center">
          Recuperación de Contraseña
        </p>
      </header>

      <section className="w-full bg-surface border-t-4 border-t-brand-main border border-border-primary rounded-xl p-6 shadow-xl dark:shadow-2xl transition-colors">
        <ForgotPasswordForm />

        <footer className="mt-6 pt-4 border-t border-border-primary flex flex-col items-center transition-colors">
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-medium text-brand-main hover:text-brand-hover transition-colors"
          >
            <ArrowLeft aria-hidden="true" size={14} /> 
            <span>Volver al Inicio de Sesión</span>
          </Link>
        </footer>
      </section>
    </main>
  );
}
