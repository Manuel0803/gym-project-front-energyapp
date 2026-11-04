'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  exerciseSchema,
  ExerciseFormValues,
} from '../schemas/exercise.schema';
import { useCreateExercise } from '../hooks/useExercises';
import { Modal } from '@/common/components/ui/Modal';
import { InputField } from '@/common/components/ui/InputField';
import { SelectField } from '@/common/components/ui/SelectField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import { Dumbbell, Loader2, Wrench } from 'lucide-react';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MUSCLE_GROUPS = [
  { value: 'PECHO', label: 'Pecho / Pectorales' },
  { value: 'ESPALDA', label: 'Espalda / Dorsales' },
  { value: 'PIERNAS', label: 'Piernas / Cuádriceps / Isquios' },
  { value: 'GLUTEOS', label: 'Glúteos' },
  { value: 'HOMBROS', label: 'Hombros / Deltoides' },
  { value: 'BICEPS', label: 'Bíceps' },
  { value: 'TRICEPS', label: 'Tríceps' },
  { value: 'ABDOMINALES', label: 'Abdominales' },
  { value: 'CORE', label: 'Core / Zona Media' },
  { value: 'CARDIO', label: 'Cardio / Resistencia' },
  { value: 'OTRO', label: 'Otro' },
];

export function ExerciseModal({ isOpen, onClose }: ExerciseModalProps) {
  const { mutate: createExercise, isPending } = useCreateExercise();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: '',
      muscleGroup: 'PECHO',
      description: '',
      equipment: '',
    },
  });

  const onSubmit = (values: ExerciseFormValues) => {
    createExercise(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isPending && onClose()}
      title="Nuevo Ejercicio para el Gimnasio"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
        <p className="text-xs text-text-muted">
          Los ejercicios creados aquí se agregarán como <strong>ejercicios locales</strong> disponibles para todos los profesores del gimnasio.
        </p>

        <InputField
          label="NOMBRE DEL EJERCICIO"
          type="text"
          placeholder="Ej: Press Banca con Mancuernas"
          disabled={isPending}
          registration={register('name')}
          error={errors.name?.message}
          icon={<Dumbbell size={16} className="text-text-muted" aria-hidden="true" />}
          className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="GRUPO MUSCULAR"
            disabled={isPending}
            registration={register('muscleGroup')}
            error={errors.muscleGroup?.message}
            className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_select]:bg-sidebar"
          >
            {MUSCLE_GROUPS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </SelectField>

          <InputField
            label="EQUIPAMIENTO / ELEMENTO"
            type="text"
            placeholder="Ej: Mancuernas, Barra, Polea..."
            disabled={isPending}
            registration={register('equipment')}
            error={errors.equipment?.message}
            icon={<Wrench size={16} className="text-text-muted" aria-hidden="true" />}
            className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
          />
        </div>

        <TextareaField
          label="DESCRIPCIÓN O TÉCNICA (OPCIONAL)"
          placeholder="Instrucciones sobre postura, agarre o rango de movimiento..."
          disabled={isPending}
          registration={register('description')}
          error={errors.description?.message}
          rows={3}
          className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_textarea]:bg-sidebar"
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-border-primary">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-text-main border border-border-primary hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-brand-main hover:bg-brand-hover text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>Crear Ejercicio</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
