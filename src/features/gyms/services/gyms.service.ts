import { httpClient } from '@/core/api/axios.adapter';
import { Gym, UpdateGymPayload } from '../interfaces/gym.interface';

export class GymsService {
  private static readonly ENDPOINT = '/gyms';

  /**
   * Retrieves gym details by a specific term (usually subdomain or UUID).
   * 
   * @param term - The search term to identify the gym.
   * @returns A promise resolving to the Gym data.
   */
  static async getByTerm(term: string): Promise<Gym> {
    return await httpClient.get<Gym>(`${this.ENDPOINT}/${term}`);
  }

  /**
   * Updates the profile information of a specific gym.
   * 
   * @param id - The UUID of the gym to update.
   * @param payload - Partial data containing the fields to update.
   * @returns A promise resolving to the updated Gym data.
   */
  static async update(id: string, payload: UpdateGymPayload): Promise<Gym> {
    return await httpClient.patch<Gym>(`${this.ENDPOINT}/${id}`, payload);
  }
}
