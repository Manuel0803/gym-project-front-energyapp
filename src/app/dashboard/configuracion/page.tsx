import { Metadata } from 'next';
import { ConfigurationTabs } from '@/features/configuration/components/ConfigurationTabs';

export const metadata: Metadata = {
  title: 'Configuración | EnergyAPP',
  description: 'Administra las preferencias generales y la seguridad de tu sistema.',
};

export default function ConfigurationPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-wide transition-colors">
            Configuración
          </h1>
          <p className="text-sm text-text-muted mt-1 transition-colors">
            Administra las preferencias de tu sistema
          </p>
        </div>
      </header>

      <section>
        <ConfigurationTabs />
      </section>
    </main>
  );
}
