'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/features/members/hooks/useMembers';
import { useCreateRoutine, useMemberRoutine } from '../hooks/useRoutines';
import {
  WeekDay,
  RoutineExerciseItem,
  WeekDaysRoutine,
  Routine,
} from '../interfaces/routine.interface';
import { Member } from '@/features/members/interfaces/members.interface';
import { Exercise } from '@/features/exercises/interfaces/exercise.interface';
import { ExerciseSelectorModal } from './ExerciseSelectorModal';
import {
  Dumbbell,
  Plus,
  Trash2,
  Calendar,
  Save,
  Loader2,
  ArrowLeft,
  FileText,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const WEEK_DAYS: { key: WeekDay; label: string }[] = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
  { key: 'SABADO', label: 'Sábado' },
  { key: 'DOMINGO', label: 'Domingo' },
];


interface RoutineBuilderFormProps {
  memberUuid: string;
  member?: Member;
  initialRoutine?: Routine | null;
}

function RoutineBuilderForm({
  memberUuid,
  member,
  initialRoutine,
}: RoutineBuilderFormProps) {
  const router = useRouter();
  const { mutate: createRoutine, isPending: isSaving } = useCreateRoutine();

  const [activeDay, setActiveDay] = useState<WeekDay>('LUNES');
  const [notes, setNotes] = useState<string>(() => initialRoutine?.notes || '');
  const [weekRoutine, setWeekRoutine] = useState<WeekDaysRoutine>(() => {
    const loaded: WeekDaysRoutine = {
      LUNES: [],
      MARTES: [],
      MIERCOLES: [],
      JUEVES: [],
      VIERNES: [],
      SABADO: [],
      DOMINGO: [],
    };
    if (Array.isArray(initialRoutine?.details)) {
      initialRoutine.details.forEach((d, index) => {
        const dayKey = (d.weekDay || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase() as WeekDay;
        if (loaded[dayKey]) {
          loaded[dayKey].push({
            id: d.uuid || `${d.exerciseUuid}-${index}`,
            exerciseUuid: d.exerciseUuid,
            exerciseName: d.exercise?.name || 'Ejercicio',
            muscleGroup: d.exercise?.muscleGroup || 'General',
            equipment: d.exercise?.equipment || '',
            series: d.series || 4,
            repetitions: d.repetitions || '12',
            restTime: d.restTime ? String(d.restTime) : '60s',
            suggestedWeight: d.suggestedWeight ? String(d.suggestedWeight) : '',
          });
        }
      });
    }
    return loaded;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add exercise to active day
  const handleAddExercise = (exercise: Exercise) => {
    const newItem: RoutineExerciseItem = {
      id: `${exercise.uuid}-${Date.now()}`,
      exerciseUuid: exercise.uuid,
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      isGlobal: exercise.isGlobal,
      series: 4,
      repetitions: '12',
      restTime: '60s',
      suggestedWeight: '',
    };

    setWeekRoutine((prev) => ({
      ...prev,
      [activeDay]: [...prev[activeDay], newItem],
    }));
  };

  // Update item field
  const handleUpdateItem = (
    itemId: string,
    field: keyof RoutineExerciseItem,
    value: unknown
  ) => {
    setWeekRoutine((prev) => ({
      ...prev,
      [activeDay]: prev[activeDay].map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Remove exercise from active day
  const handleRemoveItem = (itemId: string) => {
    setWeekRoutine((prev) => ({
      ...prev,
      [activeDay]: prev[activeDay].filter((item) => item.id !== itemId),
    }));
  };

  // Total exercises across entire week
  const totalExercisesCount = Object.values(weekRoutine).reduce(
    (acc, items) => acc + items.length,
    0
  );

  // Submit complete routine to POST /api/routines (CHGYM2-79)
  const handleSaveRoutine = () => {
    if (totalExercisesCount === 0) {
      toast.error('Agrega al menos un ejercicio a la rutina antes de guardar.');
      return;
    }

    const details = Object.entries(weekRoutine).flatMap(([day, items]) =>
      items.map((item) => {
        const rawRest = String(item.restTime || '').replace(/[^0-9]/g, '');
        const parsedRest = rawRest ? parseInt(rawRest, 10) : 60;

        const rawWeight = String(item.suggestedWeight || '')
          .replace(/,/g, '.')
          .replace(/[^0-9.]/g, '');
        const parsedWeight = rawWeight ? parseFloat(rawWeight) : undefined;

        return {
          exerciseUuid: item.exerciseUuid,
          weekDay: day,
          series: Number(item.series) || 1,
          repetitions: String(item.repetitions || '10').trim(),
          restTime: isNaN(parsedRest) ? 60 : parsedRest,
          suggestedWeight:
            parsedWeight !== undefined && !isNaN(parsedWeight)
              ? parsedWeight
              : undefined,
        };
      })
    );

    createRoutine(
      {
        memberUuid,
        notes: notes.trim() || undefined,
        details,
      },
      {
        onSuccess: () => {
          router.push('/profesor');
        },
      }
    );
  };

  const activeDayLabel =
    WEEK_DAYS.find((d) => d.key === activeDay)?.label || activeDay;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Breadcrumb & Student Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push('/profesor')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-main transition-colors w-max cursor-pointer"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Volver al Directorio de Alumnos</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Clock size={14} aria-hidden="true" />
          <span>
            Total ejercicios en la semana:{' '}
            <strong className="text-brand-main font-bold">
              {totalExercisesCount}
            </strong>
          </span>
        </div>
      </div>

      {/* Student Banner */}
      <div className="p-5 rounded-lg bg-surface border border-border-primary shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-brand-main text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
            {member ? `${member.name.charAt(0)}${member.surname.charAt(0)}` : 'AL'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-text-main">
                {member ? `${member.name} ${member.surname}` : 'Alumno'}
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-surface text-brand-main border border-brand-main/20 uppercase">
                ALUMNO
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              DNI: <span className="font-mono">{member?.dni}</span> • Armado de rutina personalizada
            </p>
          </div>
        </div>

        {member?.observations && (
          <div className="p-2.5 rounded-lg bg-background border border-border-primary flex items-start gap-2 text-xs max-w-sm">
            <User size={14} className="text-brand-main shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[11px] text-text-muted">
              <strong className="text-text-main">Ficha médica / Observaciones:</strong> {member.observations}
            </p>
          </div>
        )}
      </div>

      {/* Routine General Notes */}
      <div className="p-5 rounded-lg bg-surface border border-border-primary shadow-sm flex flex-col gap-2 transition-colors">
        <label
          htmlFor="routine-notes-input"
          className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2"
        >
          <FileText size={15} className="text-brand-main" aria-hidden="true" />
          <span>Observaciones Generales de la Rutina (Opcional)</span>
        </label>
        <textarea
          id="routine-notes-input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Plan de hipertrofia 4 días. Realizar calentamiento articular previo. Hidratación constante y estiramiento final."
          rows={2}
          className="w-full p-3 text-xs rounded-lg bg-background border border-border-primary text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand-main transition-colors"
        />
      </div>

      {/* Days Tabs (Lunes a Domingo) */}
      <div className="flex flex-col gap-4">
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin"
          role="tablist"
          aria-label="Días de la semana para la rutina"
        >
          {WEEK_DAYS.map((day) => {
            const count = weekRoutine[day.key]?.length || 0;
            const isSelected = activeDay === day.key;

            return (
              <button
                key={day.key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveDay(day.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-brand-surface border border-brand-main/30 text-brand-main font-bold shadow-xs'
                    : 'bg-surface border border-border-primary text-text-muted hover:text-text-main hover:bg-surface-hover'
                }`}
              >
                <Calendar size={14} aria-hidden="true" />
                <span>{day.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-brand-main text-white'
                      : 'bg-background border border-border-primary text-text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Day Content Area */}
        <div className="p-5 rounded-lg bg-surface border border-border-primary shadow-sm flex flex-col gap-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-primary">
            <div>
              <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
                <Dumbbell size={16} className="text-brand-main" aria-hidden="true" />
                <span>Ejercicios para el {activeDayLabel}</span>
              </h2>
              <p className="text-[11px] text-text-muted mt-0.5">
                Configure series, repeticiones, pausas y carga recomendada.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-brand-surface hover:bg-brand-main text-brand-main hover:text-white text-xs font-medium transition-all border border-brand-main/30 cursor-pointer shadow-xs"
            >
              <Plus size={15} aria-hidden="true" />
              <span>Añadir Ejercicio</span>
            </button>
          </div>

          {/* Exercises List for Active Day */}
          <div className="space-y-3">
            {weekRoutine[activeDay].map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-background border border-border-primary flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-brand-main/40 transition-colors"
              >
                {/* Exercise Identity */}
                <div className="flex items-center gap-3 min-w-0 lg:w-1/3">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border-primary flex items-center justify-center text-xs font-bold text-brand-main shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-main truncate">
                      {item.exerciseName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] px-2 py-0.2 rounded font-bold bg-surface border border-border-primary text-text-muted uppercase">
                        {item.muscleGroup}
                      </span>
                      {item.equipment && (
                        <span className="text-[10px] text-text-muted truncate">
                          {item.equipment}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Exercise Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
                  {/* Series */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                      Series
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={item.series}
                      onChange={(e) =>
                        handleUpdateItem(
                          item.id,
                          'series',
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-border-primary text-text-main focus:outline-none focus:border-brand-main font-mono text-center font-bold"
                    />
                  </div>

                  {/* Repeticiones */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                      Reps
                    </label>
                    <input
                      type="text"
                      placeholder="12 o 10-12"
                      value={item.repetitions}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'repetitions', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-border-primary text-text-main focus:outline-none focus:border-brand-main font-mono text-center font-bold"
                    />
                  </div>

                  {/* Descanso */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                      Descanso
                    </label>
                    <input
                      type="text"
                      placeholder="60s o 90s"
                      value={item.restTime}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'restTime', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-border-primary text-text-main focus:outline-none focus:border-brand-main font-mono text-center font-bold"
                    />
                  </div>

                  {/* Peso Sugerido */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                      Peso Sugerido
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 20kg"
                      value={item.suggestedWeight}
                      onChange={(e) =>
                        handleUpdateItem(
                          item.id,
                          'suggestedWeight',
                          e.target.value
                        )
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-border-primary text-text-main focus:outline-none focus:border-brand-main font-mono text-center font-bold"
                    />
                  </div>
                </div>

                {/* Remove Exercise Button */}
                <div className="flex items-center justify-end lg:pl-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 rounded-lg text-text-muted hover:text-danger-main hover:bg-danger-surface transition-colors cursor-pointer"
                    title="Quitar ejercicio"
                    aria-label={`Quitar ${item.exerciseName}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}

            {weekRoutine[activeDay].length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center text-text-muted bg-background/50 rounded-xl border border-dashed border-border-primary">
                <Dumbbell size={32} className="opacity-30 mb-2" aria-hidden="true" />
                <p className="text-xs font-semibold text-text-main">
                  Día de descanso o sin ejercicios aún
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Haz clic en &ldquo;Añadir Ejercicio&rdquo; para programar el entrenamiento del {activeDayLabel}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Save Actions Bar */}
      <div className="sticky bottom-4 z-30 p-4 rounded-lg bg-surface/95 backdrop-blur-md border border-border-primary shadow-lg flex items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles size={16} className="text-brand-main" aria-hidden="true" />
          <span className="text-text-muted hidden sm:inline">Progreso:</span>
          <span className="font-bold text-text-main">
            {totalExercisesCount}{' '}
            {totalExercisesCount === 1 ? 'ejercicio configurado' : 'ejercicios configurados'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/profesor')}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-text-main border border-border-primary hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSaveRoutine}
            disabled={isSaving || totalExercisesCount === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-brand-main hover:bg-brand-hover text-white text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Guardando Rutina...</span>
              </>
            ) : (
              <>
                <Save size={16} aria-hidden="true" />
                <span>Guardar Rutina Completa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exercise Picker Modal */}
      <ExerciseSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectExercise={handleAddExercise}
        dayLabel={activeDayLabel}
      />
    </div>
  );
}

interface RoutineBuilderViewProps {
  memberUuid: string;
}

export function RoutineBuilderView({ memberUuid }: RoutineBuilderViewProps) {
  const { data: member, isLoading: isLoadingMember } = useMember(memberUuid);
  const { data: existingRoutine, isLoading: isLoadingRoutine } =
    useMemberRoutine(memberUuid);

  if (isLoadingMember || isLoadingRoutine) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-2" />
        <span className="text-xs text-text-muted">Cargando constructor de rutina...</span>
      </div>
    );
  }

  return (
    <RoutineBuilderForm
      key={existingRoutine?.uuid || memberUuid}
      memberUuid={memberUuid}
      member={member}
      initialRoutine={existingRoutine}
    />
  );
}
