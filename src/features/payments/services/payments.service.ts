import { httpClient } from '@/core/api/axios.adapter';
import {
  CreatePaymentPayload,
  Payment,
  UpdatePaymentPayload,
} from '../interfaces/payments.interface';
import { PaginatedResult } from '@/common/interfaces/pagination.interface';

export class PaymentsService {
  private static readonly ENDPOINT = '/payments';

  /**
   * Retrieves a paginated list of payments, optionally filtered by member or status.
   *
   * @param page - The current page number (default: 1).
   * @param limit - The number of items per page (default: 10).
   * @param memberUuid - Optional UUID to filter payments by a specific member.
   * @param status - Optional status filter (e.g., 'VALID' or 'VOIDED').
   * @returns A promise resolving to a paginated result of payments.
   */
  static async getAll(
    page: number = 1,
    limit: number = 10,
    memberUuid?: string,
    status?: string
  ): Promise<PaginatedResult<Payment>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    
    if (memberUuid) params.append('memberUuid', memberUuid);
    if (status) params.append('status', status);

    return await httpClient.get<PaginatedResult<Payment>>(
      `${this.ENDPOINT}?${params.toString()}`
    );
  }

  /**
   * Retrieves a specific payment by its unique identifier.
   *
   * @param id - The UUID of the payment.
   * @returns A promise resolving to the payment data.
   */
  static async getById(id: string): Promise<Payment> {
    return await httpClient.get<Payment>(`${this.ENDPOINT}/${id}`);
  }

  /**
   * Registers a new payment in the system.
   *
   * @param payload - The data required to create the payment.
   * @returns A promise resolving to the newly created payment.
   */
  static async create(payload: CreatePaymentPayload): Promise<Payment> {
    return await httpClient.post<Payment>(this.ENDPOINT, payload);
  }

  /**
   * Updates an existing payment.
   *
   * @param id - The UUID of the payment to update.
   * @param payload - The partial data to update.
   * @returns A promise resolving to the updated payment.
   */
  static async update(
    id: string,
    payload: UpdatePaymentPayload
  ): Promise<Payment> {
    return await httpClient.patch<Payment>(`${this.ENDPOINT}/${id}`, payload);
  }

  /**
   * Soft-deletes (voids) a payment.
   *
   * @param id - The UUID of the payment to void.
   * @returns A promise resolving to the voided payment.
   */
  static async remove(id: string): Promise<Payment> {
    return await httpClient.delete<Payment>(`${this.ENDPOINT}/${id}`);
  }
}
