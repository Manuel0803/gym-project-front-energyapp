import Link from 'next/link';
import { Metadata } from 'next';
import { MapPinOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Página no encontrada | EnergyAPP',
  description: 'La ruta que intentas buscar no existe o ha sido movida.',
};

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <article className="flex flex-col items-center text-center max-w-md bg-surface border border-border-primary rounded-2xl p-8 shadow-sm">
        
        <div 
          className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-6"
          aria-hidden="true"
        >
          <MapPinOff size={32} className="text-brand-main" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-text-main tracking-tight mb-2">
          404
        </h1>
        
        <h2 className="text-xl font-bold text-text-main mb-4">
          Ruta desconocida
        </h2>
        
        <p className="text-sm text-text-muted mb-8 leading-relaxed">
          Lo sentimos, no pudimos encontrar la página que estás buscando. Es posible que haya sido eliminada, renombrada o que el enlace sea incorrecto.
        </p>
        
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-brand-main hover:brightness-110 text-white text-sm font-bold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-main focus-visible:ring-offset-background w-full sm:w-auto"
        >
          Volver al Inicio
        </Link>
        
      </article>
    </main>
  );
}
