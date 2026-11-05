import { httpClient } from '@/core/api/axios.adapter';
import { CreateRoutinePayload, Routine } from '../interfaces/routine.interface';

export class RoutinesService {
  private static readonly ENDPOINT = '/routines';

  /**
   * Creates or updates a full weekly training routine for a student.
   *
   * @param payload - Full routine definition with week details and notes.
   * @returns Newly created/saved routine.
   */
  static async createRoutine(payload: CreateRoutinePayload): Promise<Routine> {
    return await httpClient.post<Routine>(this.ENDPOINT, payload);
  }

  /**
   * Retrieves the current routine assigned to a member.
   *
   * @param memberUuid - UUID of the member.
   * @returns Routine object.
   */
  static async getRoutineByMember(memberUuid: string): Promise<Routine | null> {
    try {
      return await httpClient.get<Routine>(`${this.ENDPOINT}/member/${memberUuid}`);
    } catch {
      return null;
    }
  }
}
