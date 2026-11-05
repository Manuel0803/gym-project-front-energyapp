import { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Dumbbell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Crear Nueva Contraseña | EnergyAPP',
  description: 'Establece una nueva contraseña segura para tu cuenta.',
};

export default function ResetPasswordPage() {
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
          Crear Nueva Contraseña
        </p>
      </header>

      <section className="w-full bg-surface border-t-4 border-t-brand-main border border-border-primary rounded-xl p-6 shadow-xl dark:shadow-2xl transition-colors">
        <Suspense
          fallback={
            <div 
              className="text-center text-sm text-text-muted py-4"
              role="status"
              aria-live="polite"
            >
              Cargando...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
