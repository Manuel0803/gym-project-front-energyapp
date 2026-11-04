export type WeekDay =
  | 'LUNES'
  | 'MARTES'
  | 'MIERCOLES'
  | 'JUEVES'
  | 'VIERNES'
  | 'SABADO'
  | 'DOMINGO';

export interface RoutineDetailPayload {
  exerciseUuid: string;
  weekDay: string;
  series: number;
  repetitions: string;
  restTime?: number | string;
  suggestedWeight?: number | string;
}

export interface CreateRoutinePayload {
  memberUuid: string;
  notes?: string;
  details: RoutineDetailPayload[];
}

export interface RoutineExerciseItem {
  id: string; // unique client key (e.g. crypto.randomUUID or nanoid)
  exerciseUuid: string;
  exerciseName: string;
  muscleGroup: string;
  equipment?: string;
  isGlobal?: boolean;
  series: number;
  repetitions: string;
  restTime: string;
  suggestedWeight: string;
}

export type WeekDaysRoutine = Record<WeekDay, RoutineExerciseItem[]>;

export interface Routine {
  uuid: string;
  memberUuid: string;
  notes?: string;
  details: (RoutineDetailPayload & {
    uuid?: string;
    exercise?: {
      name: string;
      muscleGroup: string;
      equipment?: string;
    };
  })[];
  createdAt?: string;
  updatedAt?: string;
}
