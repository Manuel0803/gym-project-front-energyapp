import { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | EnergyAPP',
  description: 'Terminal de acceso seguro para usuarios de EnergyAPP.',
};

export default function LoginPage() {
  return (
    <main className="w-full max-w-[420px] flex flex-col items-center">
      <header className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-text-main tracking-tight transition-colors">
          EnergyAPP
        </h1>
        <p className="text-sm text-text-muted mt-1.5 transition-colors">
          Terminal de Inicio de Sesión
        </p>
      </header>

      <section className="w-full bg-surface border-t-4 border-t-brand-main border border-border-primary rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-colors">
        <LoginForm />

        <footer className="mt-6 pt-5 border-t border-border-primary flex flex-col items-center gap-2 transition-colors">
          <div className="flex items-center justify-center gap-2 text-text-muted transition-colors">
            <ShieldAlert size={14} aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Terminal de Acceso Seguro
            </span>
          </div>

          <div className="flex items-center justify-center text-text-muted transition-colors">
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-75">
              EnergyAPP Platform
            </span>
          </div>
        </footer>
      </section>
    </main>
  );
}
