'use client';

import { useState } from 'react';
import { useMyRoutine } from '../hooks/useStudent';
import { StudentRoutineExerciseDetail } from '../interfaces/student.interface';
import {
  Dumbbell,
  Calendar,
  Clock,
  Weight,
  Repeat,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
} from 'lucide-react';

const ORDERED_DAYS = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO',
];

const DAY_LABELS: Record<string, string> = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
};

export function StudentRoutineView() {
  const { data: routine, isLoading } = useMyRoutine();

  // Group exercise details by weekDay
  const details = routine?.details || [];
  const daysMap = details.reduce<Record<string, StudentRoutineExerciseDetail[]>>(
    (acc, item) => {
      const day = (item.weekDay || '').toUpperCase();
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    },
    {}
  );

  // List of days that actually have exercises
  const activeDays = ORDERED_DAYS.filter(
    (day) => daysMap[day] && daysMap[day].length > 0
  );

  // Accordion state: by default, the first day with exercises is expanded
  const [expandedDay, setExpandedDay] = useState<string | null>(() => {
    return activeDays[0] || null;
  });

  const toggleDay = (day: string) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
          <Dumbbell className="text-brand-main" size={22} aria-hidden="true" />
          <span>Mi Rutina de Entrenamiento</span>
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Plan de ejercicios asignado por tu instructor (modo solo lectura).
        </p>
      </div>

      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center text-text-muted">
          <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-2" />
          <span className="text-xs font-medium">Cargando tus ejercicios...</span>
        </div>
      )}

      {!isLoading && routine?.notes && (
        <div className="p-4 rounded-lg bg-surface border border-border-primary shadow-sm flex items-start gap-3">
          <FileText size={18} className="text-brand-main shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
              Indicaciones del Instructor
            </span>
            <p className="text-xs text-text-main mt-1 leading-relaxed">
              {routine.notes}
            </p>
          </div>
        </div>
      )}

      {/* Accordions per active day (CHGYM2-88) */}
      {!isLoading && activeDays.length > 0 && (
        <div className="space-y-3">
          {activeDays.map((day) => {
            const exercises = daysMap[day] || [];
            const isExpanded = expandedDay === day;
            const dayLabel = DAY_LABELS[day] || day;

            return (
              <div
                key={day}
                className="overflow-hidden rounded-lg border border-border-primary bg-surface transition-all shadow-sm"
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleDay(day)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-hover transition-colors cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                        isExpanded
                          ? 'bg-brand-main text-white'
                          : 'bg-background border border-border-primary text-text-muted'
                      }`}
                    >
                      <Calendar size={16} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-text-main">
                        {dayLabel}
                      </h2>
                      <span className="text-[11px] text-text-muted">
                        {exercises.length}{' '}
                        {exercises.length === 1 ? 'ejercicio' : 'ejercicios'}
                      </span>
                    </div>
                  </div>

                  <div className="p-1 rounded-lg text-text-muted">
                    {isExpanded ? (
                      <ChevronUp size={18} aria-hidden="true" />
                    ) : (
                      <ChevronDown size={18} aria-hidden="true" />
                    )}
                  </div>
                </button>

                {/* Accordion Content: Read-Only Exercise Cards */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-border-primary/60 space-y-3 bg-background/50">
                    {exercises.map((item, index) => (
                      <div
                        key={`${item.exerciseUuid}-${index}`}
                        className="p-4 rounded-lg bg-surface border border-border-primary flex flex-col gap-3 shadow-sm"
                      >
                        {/* Exercise Title and Muscle Group */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-brand-surface text-brand-main text-xs font-bold flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="text-sm font-bold text-text-main leading-tight">
                                {item.exercise?.name || 'Ejercicio'}
                              </h3>
                              {item.exercise?.equipment && (
                                <span className="text-[10px] text-text-muted">
                                  {item.exercise.equipment}
                                </span>
                              )}
                            </div>
                          </div>

                          {item.exercise?.muscleGroup && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-background border border-border-primary text-text-muted uppercase shrink-0">
                              {item.exercise.muscleGroup}
                            </span>
                          )}
                        </div>

                        {/* Large, clear mobile cards metrics */}
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border-primary/40">
                          {/* Series */}
                          <div className="p-2.5 rounded-lg bg-background border border-border-primary/50 flex flex-col">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-muted flex items-center gap-1">
                              <Layers size={11} className="text-brand-main" aria-hidden="true" />
                              <span>Series</span>
                            </span>
                            <span className="text-lg font-black text-text-main font-mono mt-0.5">
                              {item.series}
                            </span>
                          </div>

                          {/* Reps */}
                          <div className="p-2.5 rounded-lg bg-background border border-border-primary/50 flex flex-col">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-muted flex items-center gap-1">
                              <Repeat size={11} className="text-brand-main" aria-hidden="true" />
                              <span>Reps</span>
                            </span>
                            <span className="text-lg font-black text-text-main font-mono mt-0.5">
                              {item.repetitions}
                            </span>
                          </div>

                          {/* Rest */}
                          <div className="p-2.5 rounded-lg bg-background border border-border-primary/50 flex flex-col">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-muted flex items-center gap-1">
                              <Clock size={11} className="text-brand-main" aria-hidden="true" />
                              <span>Descanso</span>
                            </span>
                            <span className="text-sm font-bold text-text-main font-mono mt-0.5">
                              {item.restTime || '60s'}
                            </span>
                          </div>

                          {/* Weight */}
                          <div className="p-2.5 rounded-lg bg-background border border-border-primary/50 flex flex-col">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-muted flex items-center gap-1">
                              <Weight size={11} className="text-brand-main" aria-hidden="true" />
                              <span>Carga Sugerida</span>
                            </span>
                            <span className="text-sm font-bold text-brand-main font-mono mt-0.5">
                              {item.suggestedWeight || 'A criterio'}
                            </span>
                          </div>
                        </div>

                        {item.exercise?.description && (
                          <p className="text-[11px] text-text-muted italic pt-1 border-t border-border-primary/40 leading-relaxed">
                            Nota técnica: {item.exercise.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && activeDays.length === 0 && (
        <div className="py-16 px-4 rounded-3xl bg-surface border border-border-primary flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-surface-hover flex items-center justify-center text-text-muted mb-3">
            <Dumbbell size={28} className="opacity-40" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-bold text-text-main">
            Sin rutina asignada
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xs leading-relaxed">
            Tu entrenador todavía no ha cargado una rutina para ti. Acércate a la sala de profesores para solicitarla.
          </p>
        </div>
      )}
    </div>
  );
}
