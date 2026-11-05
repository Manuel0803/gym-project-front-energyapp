import { httpClient } from '@/core/api/axios.adapter';
import {
  CreatePlanPayload,
  Plan,
  UpdatePlanPayload,
} from '../interfaces/plan.interface';
import { PaginatedResult } from '@/common/interfaces/pagination.interface';

export class PlansService {
  private static readonly ENDPOINT = '/membership-plans';

  /**
   * Retrieves a paginated list of membership plans.
   *
   * @param page - The current page number (default: 1).
   * @param limit - The number of items per page (default: 10).
   * @returns A promise that resolves to a paginated result of plans.
   */
  static async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<Plan>> {
    return await httpClient.get<PaginatedResult<Plan>>(
      `${this.ENDPOINT}?page=${page}&limit=${limit}`
    );
  }

  /**
   * Retrieves a specific membership plan by its unique identifier.
   *
   * @param id - The UUID of the plan.
   * @returns A promise that resolves to the plan data.
   */
  static async getById(id: string): Promise<Plan> {
    return await httpClient.get<Plan>(`${this.ENDPOINT}/${id}`);
  }

  /**
   * Creates a new membership plan.
   *
   * @param payload - The data required to create a plan.
   * @returns A promise that resolves to the newly created plan.
   */
  static async create(payload: CreatePlanPayload): Promise<Plan> {
    return await httpClient.post<Plan>(this.ENDPOINT, payload);
  }

  /**
   * Updates an existing membership plan.
   *
   * @param id - The UUID of the plan to update.
   * @param payload - The partial data to update the plan with.
   * @returns A promise that resolves to the updated plan.
   */
  static async update(id: string, payload: UpdatePlanPayload): Promise<Plan> {
    return await httpClient.patch<Plan>(`${this.ENDPOINT}/${id}`, payload);
  }

  /**
   * Soft-deletes (deactivates) a membership plan.
   *
   * @param id - The UUID of the plan to remove.
   * @returns A promise that resolves to the removed plan.
   */
  static async remove(id: string): Promise<Plan> {
    return await httpClient.delete<Plan>(`${this.ENDPOINT}/${id}`);
  }
}
