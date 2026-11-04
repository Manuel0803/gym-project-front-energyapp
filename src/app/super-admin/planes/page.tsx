import { Metadata } from 'next';
import { Check, Plus, Zap, Shield, Crown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Planes SaaS | Super Admin EnergyAPP',
  description: 'Estructura de precios y planes de suscripción SaaS para gimnasios clientes.',
};

export default function SuperAdminPlanesPage() {
  const saasPlans = [
    {
      id: 'plan-basic',
      name: 'Plan Básico',
      description: 'Ideal para gimnasios pequeños y estudios individuales.',
      price: '$29.999',
      period: '/mes',
      icon: Zap,
      features: [
        'Hasta 150 miembros activos',
        'Panel de control estándar',
        'Gestión de cobros y membresías',
        'Soporte estándar por email',
      ],
      popular: false,
    },
    {
      id: 'plan-pro',
      name: 'Plan Pro',
      description: 'Para centros de entrenamiento medianos en expansión.',
      price: '$54.999',
      period: '/mes',
      icon: Shield,
      features: [
        'Hasta 500 miembros activos',
        'Subdominio personalizado',
        'Módulo de Profesores y Rutinas',
        'Control de acceso y asistencias',
        'Soporte prioritario 24/7',
      ],
      popular: true,
    },
    {
      id: 'plan-enterprise',
      name: 'Plan Enterprise',
      description: 'Cadenas de gimnasios y franquicias de alto volumen.',
      price: '$99.999',
      period: '/mes',
      icon: Crown,
      features: [
        'Miembros activos ilimitados',
        'Múltiples sedes centralizadas',
        'Reportes y métricas avanzadas',
        'API de integración y Webhooks',
        'Gerente de cuenta dedicado',
      ],
      popular: false,
    },
  ];

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main transition-colors">
            Planes y Tarifas SaaS
          </h1>
          <p className="text-sm text-text-muted mt-1 transition-colors">
            Configuración de planes de suscripción para los gimnasios clientes de EnergyAPP.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-main hover:bg-brand-hover text-white text-sm font-medium transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Nuevo Plan SaaS</span>
        </button>
      </header>

      {/* Plans Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {saasPlans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`flex flex-col border bg-surface rounded-lg transition-colors relative ${
                plan.popular
                  ? 'border-brand-main shadow-sm ring-1 ring-brand-main'
                  : 'border-border-primary'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-main text-white shadow-sm">
                  Más Popular
                </span>
              )}

              <div className="flex flex-col gap-2 border-b border-border-primary p-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xl text-text-main capitalize">
                    {plan.name}
                  </h3>
                  <div className="text-text-muted">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-text-main tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-text-muted font-medium">
                    {plan.period}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1 min-h-8">
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                    Características incluidas
                  </span>
                  <ul className="space-y-2.5 text-xs text-text-main">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check
                          size={15}
                          className="text-success-main shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border-primary">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-lg text-xs font-semibold border border-border-primary text-text-main hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    Editar Plan
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
