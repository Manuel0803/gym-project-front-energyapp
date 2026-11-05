import { httpClient } from '@/core/api/axios.adapter';
import { PaginatedResult } from '@/common/interfaces/pagination.interface';
import {
  CreateMemberPayload,
  GetMembersParams,
  ImportMembersResponse,
  Member,
  UpdateMemberPayload,
} from '../interfaces/members.interface';

export class MembersService {
  private static readonly ENDPOINT = '/members';

  /**
   * Retrieves a paginated and filtered list of members.
   * 
   * @param params - Optional query parameters for pagination, filtering (term, state, planId, initial), and sorting.
   * @returns A promise that resolves to a paginated result containing the list of members and metadata.
   */
  static async getAll(
    params: GetMembersParams = {}
  ): Promise<PaginatedResult<Member>> {
    const {
      page = 1,
      limit = 10,
      term,
      state,
      planId,
      sortBy,
      order,
      initial,
    } = params;

    const searchParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (term) searchParams.append('term', term);
    if (state) searchParams.append('state', state);
    if (planId) searchParams.append('planId', planId);
    if (sortBy) searchParams.append('sortBy', sortBy);
    if (order) searchParams.append('order', order);
    if (initial) searchParams.append('initial', initial);

    return await httpClient.get<PaginatedResult<Member>>(
      `${this.ENDPOINT}?${searchParams.toString()}`
    );
  }

  /**
   * Retrieves detailed information of a specific member by their unique identifier.
   * 
   * @param id - The UUID of the member to retrieve.
   * @returns A promise that resolves to the member's data.
   */
  static async getById(id: string): Promise<Member> {
    return await httpClient.get<Member>(`${this.ENDPOINT}/${id}`);
  }

  /**
   * Creates a new member in the system and optionally assigns an initial plan.
   * 
   * @param payload - The required personal, contact, and optional medical/plan data for the new member.
   * @returns A promise that resolves to the newly created member object.
   */
  static async create(payload: CreateMemberPayload): Promise<Member> {
    return await httpClient.post<Member>(this.ENDPOINT, payload);
  }

  /**
   * Updates an existing member's profile information.
   * 
   * @param id - The UUID of the member to update.
   * @param payload - The partial data payload containing the fields to be updated.
   * @returns A promise that resolves to the updated member object.
   */
  static async update(id: string, payload: UpdateMemberPayload): Promise<Member> {
    return await httpClient.patch<Member>(`${this.ENDPOINT}/${id}`, payload);
  }

  /**
   * Permanently deletes a member from the system. 
   * Note: This operation might be restricted by the backend if financial records exist.
   * 
   * @param id - The UUID of the member to remove.
   * @returns A promise that resolves to the deleted member's data.
   */
  static async remove(id: string): Promise<Member> {
    return await httpClient.delete<Member>(`${this.ENDPOINT}/${id}`);
  }

  /**
   * Soft-deactivates a member, canceling their active subscriptions without deleting their record.
   * 
   * @param id - The UUID of the member to deactivate.
   * @returns A promise that resolves to the deactivated member object.
   */
  static async deactivate(id: string): Promise<Member> {
    return await httpClient.patch<Member>(`${this.ENDPOINT}/${id}/deactivate`);
  }

  /**
   * Renews a member's current or previous plan and processes the associated payment.
   * 
   * @param id - The UUID of the member renewing their plan.
   * @param payload - Object containing the target plan UUID and the chosen payment method.
   * @returns A promise that resolves to the updated member object.
   */
  static async renewPlan(
    id: string,
    payload: { planUuid: string; paymentMethod: string }
  ): Promise<Member> {
    return await httpClient.post<Member>(`${this.ENDPOINT}/${id}/renew`, payload);
  }

  /**
   * Upgrades or downgrades a member's active plan, handling billing adjustments.
   * 
   * @param id - The UUID of the member changing their plan.
   * @param payload - Object detailing the new plan, payment method, and when the change should take effect.
   * @returns A promise that resolves to the updated member object.
   */
  static async changePlan(
    id: string,
    payload: {
      newPlanUuid: string;
      paymentMethod: string;
      activationType: 'IMMEDIATE' | 'SCHEDULED';
    }
  ): Promise<Member> {
    return await httpClient.post<Member>(
      `${this.ENDPOINT}/${id}/change-plan`,
      payload
    );
  }

  /**
   * Imports members in bulk from a CSV file.
   *
   * @param file - The uploaded CSV file containing member rows.
   * @returns A promise resolving to the import outcome report.
   */
  static async importCsv(file: File): Promise<ImportMembersResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return await httpClient.post<ImportMembersResponse>(
      `${this.ENDPOINT}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
}
