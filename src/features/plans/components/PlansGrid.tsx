'use client';

import Link from 'next/link';
import { usePlans } from '../hooks/usePlans';
import { useRole } from '@/features/auth/hooks/useRole';
import { formatDuration } from '../utils/format-duration';
import { parseDescription } from '../utils/parse-description';
import { Check, AlertCircle } from 'lucide-react';

export function PlansGrid() {
  const { data, isLoading, isError } = usePlans(1, 100);
  const { isAdmin, isSuperAdmin } = useRole();
  const canEdit = isAdmin || isSuperAdmin;

  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="status"
        aria-live="polite"
      >
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex flex-col border border-border-primary bg-surface rounded-lg animate-pulse"
            aria-hidden="true"
          >
            <div className="flex flex-col gap-2 border-b border-border-primary p-6">
              <div className="h-6 w-3/4 bg-border-primary/80 rounded"></div>
              <div className="h-8 w-1/2 bg-border-primary/40 rounded mt-1"></div>
            </div>
            <div className="flex-1 p-6 flex flex-col gap-4">
              <div className="h-4 w-full bg-border-primary/30 rounded"></div>
              <div className="h-4 w-5/6 bg-border-primary/30 rounded"></div>
              <div className="h-4 w-4/6 bg-border-primary/30 rounded"></div>
            </div>
            {canEdit && (
              <div className="flex justify-end border-t border-border-primary p-3 bg-background/50 rounded-b-lg">
                <div className="h-6 w-16 bg-border-primary/40 rounded"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-64 w-full bg-danger-surface dark:bg-danger-surface rounded-lg border border-danger-main dark:border-danger-main"
        role="alert"
      >
        <AlertCircle className="w-10 h-10 text-danger-main mb-4" aria-hidden="true" />
        <h3 className="text-lg font-bold text-danger-main dark:text-danger-main">
          Error de conexión
        </h3>
        <p className="text-danger-main dark:text-danger-main text-sm mt-1 text-center">
          No se pudieron cargar los planes. Intenta nuevamente.
        </p>
      </div>
    );
  }

  const plans = data?.data || [];

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border-primary rounded-lg bg-surface/50">
        <p className="text-text-muted text-lg text-center">
          No hay planes registrados en este gimnasio.
        </p>
      </div>
    );
  }

  const priceFormatter = new Intl.NumberFormat('es-AR');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const features = parseDescription(plan.description);

        return (
          <article
            key={plan.uuid}
            className="flex flex-col border border-border-primary bg-surface rounded-lg hover:shadow-md hover:border-brand-main/30 transition-all duration-300"
          >
            <header className="flex flex-col gap-2 border-b border-border-primary p-6">
              <h2 className="text-xl font-bold text-text-main">{plan.name}</h2>
              <p className="text-sm text-text-muted">
                <span className="text-brand-main text-3xl font-semibold">
                  ${priceFormatter.format(plan.price)}
                </span>{' '}
                <span className="text-text-muted">
                  / {formatDuration(plan.durationDays)}
                </span>
              </p>
            </header>

            <div className="flex-1 p-6">
              <ul 
                className="list-none flex flex-col gap-3"
                aria-label={`Características del plan ${plan.name}`}
              >
                {features.map((item, index) => (
                  <li key={`${plan.uuid}-feature-${index}`} className="flex items-start gap-3">
                    <Check
                      size={20}
                      className="text-brand-main shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-md text-text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {canEdit && (
              <footer className="flex justify-end border-t border-border-primary p-2 bg-background/50 rounded-b-lg">
                <Link
                  href={`/dashboard/planes/${plan.uuid}/editar`}
                  className="bg-brand-main hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  aria-label={`Editar configuración del plan ${plan.name}`}
                >
                  Editar
                </Link>
              </footer>
            )}
          </article>
        );
      })}
    </div>
  );
}
