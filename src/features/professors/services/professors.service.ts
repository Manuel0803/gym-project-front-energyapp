import { httpClient } from '@/core/api/axios.adapter';
import {
  AssignedStudent,
  GetMyStudentsParams,
  Professor,
} from '../interfaces/professors.interface';
import { PaginatedResult } from '@/common/interfaces/pagination.interface';

export class ProfessorsService {
  private static readonly ENDPOINT = '/professors';

  /**
   * Retrieves the list of active professors/trainers in the gym.
   */
  static async getProfessors(): Promise<Professor[]> {
    const response = await httpClient.get<
      Professor[] | { data: Professor[] }
    >(this.ENDPOINT);

    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response)) {
      return response;
    }

    return [];
  }

  /**
   * Retrieves the list of students assigned to the currently authenticated professor.
   *
   * @param params - Optional search term, page, and limit.
   * @returns Array or paginated result of assigned students.
   */
  static async getMyStudents(
    params: GetMyStudentsParams = {}
  ): Promise<AssignedStudent[]> {
    const searchParams = new URLSearchParams();
    if (params.term) searchParams.append('term', params.term);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));

    const queryString = searchParams.toString();
    const url = queryString
      ? `${this.ENDPOINT}/my-students?${queryString}`
      : `${this.ENDPOINT}/my-students`;

    const response = await httpClient.get<
      AssignedStudent[] | PaginatedResult<AssignedStudent>
    >(url);

    // Normalize response if returned as paginated result
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response)) {
      return response;
    }

    return [];
  }
}
