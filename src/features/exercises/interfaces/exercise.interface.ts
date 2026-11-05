export type MuscleGroup =
  | 'PECHO'
  | 'ESPALDA'
  | 'PIERNAS'
  | 'HOMBROS'
  | 'BICEPS'
  | 'TRICEPS'
  | 'ABDOMINALES'
  | 'CARDIO'
  | 'CORE'
  | 'GLUTEOS'
  | 'OTRO';

export interface Exercise {
  uuid: string;
  name: string;
  muscleGroup: MuscleGroup | string;
  description?: string;
  equipment?: string;
  isGlobal: boolean; // true = Catálogo Global del sistema, false = Local / Propio del Gimnasio
  gymUuid?: string | null;
  videoUrl?: string;
  createdAt?: string;
}

export interface CreateExercisePayload {
  name: string;
  muscleGroup: MuscleGroup | string;
  description?: string;
  equipment?: string;
}

export interface ExerciseCatalogParams {
  search?: string;
  muscle_group?: string;
}
