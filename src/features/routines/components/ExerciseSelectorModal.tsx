'use client';

import { useState } from 'react';
import { useExercisesCatalog } from '@/features/exercises/hooks/useExercises';
import { Exercise } from '@/features/exercises/interfaces/exercise.interface';
import { Modal } from '@/common/components/ui/Modal';
import {
  Search,
  Dumbbell,
  Plus,
  Loader2,
  Globe,
  Building2,
  Filter,
} from 'lucide-react';

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  dayLabel: string;
}

const MUSCLE_FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
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

export function ExerciseSelectorModal({
  isOpen,
  onClose,
  onSelectExercise,
  dayLabel,
}: ExerciseSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');

  const { data: exercises = [], isLoading } = useExercisesCatalog({
    search: searchTerm || undefined,
    muscle_group: selectedMuscle || undefined,
  });

  const handleSelect = (exercise: Exercise) => {
    onSelectExercise(exercise);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Agregar Ejercicio para el ${dayLabel}`}
    >
      <div className="flex flex-col gap-4 mt-2 max-h-[75vh]">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o equipamiento..."
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface border border-border-primary text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand-main transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Filter size={14} className="text-text-muted" aria-hidden="true" />
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="h-9 bg-surface border border-border-primary text-xs font-medium rounded-lg px-2.5 text-text-main focus:outline-none focus:border-brand-main transition-colors cursor-pointer"
              aria-label="Filtrar por músculo"
            >
              {MUSCLE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercises List */}
        <div className="overflow-y-auto space-y-2 pr-1 min-h-50 max-h-96 scrollbar-thin">
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-text-muted">
              <Loader2 size={24} className="animate-spin text-brand-main mb-2" />
              <span className="text-xs">Buscando ejercicios...</span>
            </div>
          )}

          {!isLoading &&
            exercises.map((ex) => (
              <div
                key={ex.uuid}
                className="p-3 rounded-lg bg-surface border border-border-primary hover:border-brand-main/60 transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-background border border-border-primary text-text-muted uppercase">
                      {ex.muscleGroup}
                    </span>

                    {ex.isGlobal ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-brand-surface text-brand-main">
                        <Globe size={10} aria-hidden="true" />
                        <span>Global</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-success-surface text-success-main">
                        <Building2 size={10} aria-hidden="true" />
                        <span>Local</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-text-main truncate group-hover:text-brand-main transition-colors">
                    {ex.name}
                  </p>

                  {ex.equipment && (
                    <p className="text-[10px] text-text-muted truncate mt-0.5">
                      Equipamiento: {ex.equipment}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleSelect(ex)}
                  className="px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-main text-brand-main hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  aria-label={`Seleccionar ${ex.name}`}
                >
                  <Plus size={14} aria-hidden="true" />
                  <span>Agregar</span>
                </button>
              </div>
            ))}

          {!isLoading && exercises.length === 0 && (
            <div className="py-12 text-center text-xs text-text-muted">
              <Dumbbell size={28} className="mx-auto text-text-muted mb-2 opacity-40" />
              <p>No se encontraron ejercicios en el catálogo.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-border-primary">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-text-main border border-border-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
