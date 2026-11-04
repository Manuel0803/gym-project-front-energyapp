import { Metadata } from 'next';
import { Building2, Plus, Users, Activity, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gimnasios | Super Admin EnergyAPP',
  description: 'Gestión global de gimnasios clientes y tenants registrados en el sistema.',
};

export default function SuperAdminGymsPage() {
  const dummyGyms = [
    {
      id: '1',
      name: 'Energy Fitness Club',
      subdomain: 'energy',
      domain: 'energy.energyapp.com',
      membersCount: 420,
      status: 'Activo',
      plan: 'Plan Enterprise',
      createdAt: '15/01/2026',
    },
    {
      id: '2',
      name: 'Iron Cross Training',
      subdomain: 'iron',
      domain: 'iron.energyapp.com',
      membersCount: 185,
      status: 'Activo',
      plan: 'Plan Pro',
      createdAt: '03/03/2026',
    },
    {
      id: '3',
      name: 'Olympus Gym & Spa',
      subdomain: 'olympus',
      domain: 'olympus.energyapp.com',
      membersCount: 95,
      status: 'Activo',
      plan: 'Plan Básico',
      createdAt: '28/05/2026',
    },
  ];

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main transition-colors">
            Gimnasios Clientes
          </h1>
          <p className="text-sm text-text-muted mt-1 transition-colors">
            Administración centralizada de tenants, dominios y suscripciones SaaS.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-main hover:bg-brand-hover text-white text-sm font-medium transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Registrar Gimnasio</span>
        </button>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Métricas de gimnasios">
        <article className="bg-surface rounded-lg p-5 border border-border-primary transition-colors shadow-sm flex flex-col justify-between">
          <header className="flex justify-between items-start mb-4 gap-4">
            <h3 className="text-[10px] font-bold text-text-muted tracking-wider uppercase">
              Total Gimnasios
            </h3>
            <div aria-hidden="true" className="text-text-muted shrink-0">
              <Building2 size={20} />
            </div>
          </header>
          <div className="text-3xl font-bold text-text-main transition-colors tracking-tight">
            3
          </div>
          <footer className="flex items-center justify-between mt-3 text-xs transition-colors">
            <span className="text-success-main font-medium text-xs">
              100% operativos
            </span>
          </footer>
        </article>

        <article className="bg-surface rounded-lg p-5 border border-border-primary transition-colors shadow-sm flex flex-col justify-between">
          <header className="flex justify-between items-start mb-4 gap-4">
            <h3 className="text-[10px] font-bold text-text-muted tracking-wider uppercase">
              Alumnos en Plataforma
            </h3>
            <div aria-hidden="true" className="text-text-muted shrink-0">
              <Users size={20} />
            </div>
          </header>
          <div className="text-3xl font-bold text-text-main transition-colors tracking-tight">
            700
          </div>
          <footer className="flex items-center justify-between mt-3 text-xs transition-colors">
            <span className="text-brand-main font-medium text-xs">
              Total consolidado
            </span>
          </footer>
        </article>

        <article className="bg-surface rounded-lg p-5 border border-border-primary transition-colors shadow-sm flex flex-col justify-between">
          <header className="flex justify-between items-start mb-4 gap-4">
            <h3 className="text-[10px] font-bold text-text-muted tracking-wider uppercase">
              Estado de Red SaaS
            </h3>
            <div aria-hidden="true" className="text-text-muted shrink-0">
              <Activity size={20} />
            </div>
          </header>
          <div className="text-3xl font-bold text-success-main transition-colors tracking-tight">
            Óptimo
          </div>
          <footer className="flex items-center justify-between mt-3 text-xs transition-colors">
            <span className="text-text-muted font-medium text-xs">
              Uptime 99.98%
            </span>
          </footer>
        </article>
      </section>

      {/* Gyms Table / List */}
      <section className="bg-surface border border-border-primary rounded-lg overflow-hidden shadow-sm transition-colors flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border-primary">
          <h2 className="text-base font-bold text-text-main">
            Listado de Centros Registrados
          </h2>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Buscar por nombre o subdominio..."
              className="h-9 w-full pl-9 pr-4 text-xs rounded-lg bg-surface border border-border-primary text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand-main transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-background border-b border-border-primary">
              <tr>
                <th className="px-5 py-3 font-bold">Gimnasio</th>
                <th className="px-5 py-3 font-bold">Subdominio</th>
                <th className="px-5 py-3 font-bold">Plan SaaS</th>
                <th className="px-5 py-3 font-bold text-center">Alumnos</th>
                <th className="px-5 py-3 font-bold">Estado</th>
                <th className="px-5 py-3 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary text-xs">
              {dummyGyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-4 font-semibold text-text-main">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-background border border-border-primary flex items-center justify-center text-xs font-bold text-brand-main">
                        {gym.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-text-main">{gym.name}</p>
                        <p className="text-[11px] text-text-muted">Desde {gym.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-muted font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-background border border-border-primary">
                      {gym.domain}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-text-main font-medium">
                    {gym.plan}
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-text-main">
                    {gym.membersCount}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold border rounded-md uppercase bg-success-surface text-success-main border-success-main/30">
                      <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-success-main" aria-hidden="true" />
                      {gym.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-brand-main hover:bg-brand-surface transition-colors cursor-pointer"
                    >
                      Configurar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
