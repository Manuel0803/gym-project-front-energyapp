import { httpClient } from '@/core/api/axios.adapter';
import { CreateSalePayload, Sale } from '../interfaces/pos.interface';
import { PaginatedResult } from '@/common/interfaces/pagination.interface';

export class PosService {
  private static readonly ENDPOINT = '/sales';

  /**
   * Registers a new sale from the Point of Sale terminal.
   *
   * @param payload - The sale items, payment method, and optional customer UUID.
   * @returns A promise resolving to the created sale record.
   */
  static async createSale(payload: CreateSalePayload): Promise<Sale> {
    return await httpClient.post<Sale>(this.ENDPOINT, payload);
  }

  /**
   * Voids an existing sale ticket and restores product stock.
   *
   * @param uuid - The UUID of the sale to void.
   * @returns A promise resolving to the voided sale.
   */
  static async voidSale(uuid: string): Promise<Sale> {
    return await httpClient.patch<Sale>(`${this.ENDPOINT}/${uuid}/void`, {});
  }

  /**
   * Retrieves sales records with optional pagination and filters.
   *
   * @param page - Page number (default: 1).
   * @param limit - Items per page (default: 10).
   * @param customerUuid - Optional filter by customer.
   * @returns Paginated result of sales.
   */
  static async getSales(
    page: number = 1,
    limit: number = 10,
    customerUuid?: string
  ): Promise<PaginatedResult<Sale>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (customerUuid) params.append('customerUuid', customerUuid);

    return await httpClient.get<PaginatedResult<Sale>>(
      `${this.ENDPOINT}?${params.toString()}`
    );
  }
}
