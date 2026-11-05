import { Metadata } from 'next';
import { OnboardingForm } from '@/features/auth/components/OnboardingForm';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Configuración Inicial de Cuenta | EnergyAPP',
  description:
    'Por motivos de seguridad, debes actualizar tu correo electrónico y definir tu contraseña personal antes de continuar.',
};

export default function OnboardingPage() {
  return (
    <main className="w-full max-w-[440px] flex flex-col items-center">
      <header className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight transition-colors">
          Configuración Inicial
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-sm transition-colors">
          Para garantizar la seguridad de tu acceso, actualiza tu correo electrónico y define una contraseña personal.
        </p>
      </header>

      <section className="w-full bg-surface border-t-4 border-t-brand-main border border-border-primary rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-colors">
        <OnboardingForm />

        <footer className="mt-6 pt-5 border-t border-border-primary flex items-center justify-center gap-2 text-text-muted transition-colors">
          <ShieldCheck size={14} className="text-brand-main" aria-hidden="true" />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            Paso obligatorio de seguridad
          </span>
        </footer>
      </section>
    </main>
  );
}
