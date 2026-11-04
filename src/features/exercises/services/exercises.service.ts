import { httpClient } from '@/core/api/axios.adapter';
import {
  CreateExercisePayload,
  Exercise,
  ExerciseCatalogParams,
} from '../interfaces/exercise.interface';

export class ExercisesService {
  private static readonly ENDPOINT = '/exercises';

  /**
   * Retrieves the hybrid catalog of exercises (combining global system exercises and local gym exercises).
   *
   * @param params - Optional search term and muscle_group filter.
   * @returns Array of exercises.
   */
  static async getCatalog(params: ExerciseCatalogParams = {}): Promise<Exercise[]> {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.muscle_group) searchParams.append('muscle_group', params.muscle_group);

    const queryString = searchParams.toString();
    const url = queryString
      ? `${this.ENDPOINT}/catalog?${queryString}`
      : `${this.ENDPOINT}/catalog`;

    return await httpClient.get<Exercise[]>(url);
  }

  /**
   * Creates a new local exercise for the current gym.
   *
   * @param payload - Exercise details (name, muscleGroup, description, equipment).
   * @returns Newly created exercise.
   */
  static async createExercise(payload: CreateExercisePayload): Promise<Exercise> {
    return await httpClient.post<Exercise>(this.ENDPOINT, payload);
  }
}
