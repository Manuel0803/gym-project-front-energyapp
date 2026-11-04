'use client';

import { useState } from 'react';
import { useExercisesCatalog } from '../hooks/useExercises';
import { ExerciseModal } from './ExerciseModal';
import {
  Dumbbell,
  Search,
  Plus,
  Globe,
  Building2,
  Loader2,
  Filter,
  Wrench,
} from 'lucide-react';

const MUSCLE_FILTER_OPTIONS = [
  { value: '', label: 'Todos los músculos' },
  { value: 'PECHO', label: 'Pecho' },
  { value: 'ESPALDA', label: 'Espalda' },
  { value: 'PIERNAS', label: 'Piernas' },
  { value: 'GLUTEOS', label: 'Glúteos' },
  { value: 'HOMBROS', label: 'Hombros' },
  { value: 'BICEPS', label: 'Bíceps' },
  { value: 'TRICEPS', label: 'Tríceps' },
  { value: 'ABDOMINALES', label: 'Abdominales' },
  { value: 'CORE', label: 'Core' },
  { value: 'CARDIO', label: 'Cardio' },
];

export function ExercisesCatalogView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: exercises = [], isLoading } = useExercisesCatalog({
    search: searchTerm || undefined,
    muscle_group: selectedMuscle || undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top action bar: Search, filters and Create button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ejercicio por nombre o equipamiento..."
              className="h-9 w-full pl-9 pr-4 text-xs rounded-lg bg-surface border border-border-primary text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand-main transition-colors shadow-xs"
            />
          </div>

          {/* Muscle Group Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={15} className="text-text-muted" aria-hidden="true" />
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="h-9 bg-surface border border-border-primary text-xs font-medium rounded-lg px-3 text-text-main focus:outline-none focus:border-brand-main transition-colors shadow-xs cursor-pointer"
              aria-label="Filtrar por grupo muscular"
            >
              {MUSCLE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Create Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="h-9 inline-flex items-center justify-center gap-2 px-4 rounded-lg bg-brand-main hover:bg-brand-hover text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Crear Nuevo Ejercicio</span>
        </button>
      </div>

      {/* Grid of Exercises */}
      <div className="relative min-h-60">
        {isLoading && (
          <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 rounded-lg">
            <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-2" aria-hidden="true" />
            <span className="text-xs font-medium text-text-muted">Cargando catálogo híbrido...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => {
            const isGlobal = exercise.isGlobal;

            return (
              <div
                key={exercise.uuid}
                className="p-5 rounded-lg bg-surface border border-border-primary shadow-sm hover:border-brand-main/40 transition-colors flex flex-col justify-between gap-4 group"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    {/* Muscle group badge */}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-background border border-border-primary text-text-muted uppercase tracking-wider">
                      {exercise.muscleGroup}
                    </span>

                    {/* Global vs Local Hybrid Indicator */}
                    {isGlobal ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-surface text-brand-main border border-brand-main/30">
                        <Globe size={11} aria-hidden="true" />
                        <span>Catálogo Global</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-success-surface text-success-main border border-success-main/30">
                        <Building2 size={11} aria-hidden="true" />
                        <span>Propio del Gimnasio</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-text-main group-hover:text-brand-main transition-colors flex items-center gap-2">
                    <Dumbbell size={16} className="text-brand-main shrink-0" aria-hidden="true" />
                    <span>{exercise.name}</span>
                  </h3>

                  {exercise.description && (
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {exercise.description}
                    </p>
                  )}
                </div>

                {exercise.equipment && (
                  <div className="pt-3 border-t border-border-primary flex items-center gap-1.5 text-[11px] text-text-muted">
                    <Wrench size={13} className="shrink-0" aria-hidden="true" />
                    <span className="truncate">Elemento: {exercise.equipment}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!isLoading && exercises.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-surface border border-border-primary rounded-lg p-8">
            <Dumbbell size={36} className="text-text-muted mb-2 opacity-50" aria-hidden="true" />
            <p className="text-xs font-bold text-text-main">
              No se encontraron ejercicios
            </p>
            <p className="text-[11px] text-text-muted mt-1 max-w-sm">
              Prueba con otro término de búsqueda o grupo muscular, o haz clic en &ldquo;Crear Nuevo Ejercicio&rdquo; para sumar un ejercicio personalizado al gimnasio.
            </p>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <ExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
