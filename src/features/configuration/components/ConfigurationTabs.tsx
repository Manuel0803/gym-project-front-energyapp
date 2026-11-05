'use client';

import { useState } from 'react';
import { GeneralTab } from './GeneralTab';
import { SecurityTab } from './SecurityTab';
import { Building, Lock } from 'lucide-react';

export function ConfigurationTabs() {
  const [activeTab, setActiveTab] = useState<'general' | 'seguridad'>('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Building },
    { id: 'seguridad', name: 'Seguridad', icon: Lock },
  ] as const;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <nav className="w-full lg:w-64 flex flex-col gap-1 shrink-0" aria-label="Pestañas de configuración">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'general' | 'seguridad')}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-brand-surface text-brand-main shadow-sm'
                  : 'text-text-muted hover:bg-surface hover:text-text-main'
              }`}
            >
              <Icon size={18} aria-hidden="true" className={isActive ? 'text-brand-main' : ''} />
              {tab.name}
            </button>
          );
        })}
      </nav>

      <div 
        role="tabpanel"
        className="flex-1 bg-surface border border-border-primary rounded-xl transition-colors overflow-hidden shadow-sm dark:shadow-none"
      >
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'seguridad' && <SecurityTab />}
      </div>
    </div>
  );
}
