import { httpClient } from '@/core/api/axios.adapter';
import { MetricsOverview } from '../interfaces/metrics.interface';

export class MetricsService {
  private static readonly ENDPOINT = '/metrics';

  /**
   * Fetches the global metrics and analytics overview for the system.
   * 
   * @param year - Optional year to filter the data (e.g., 2024, '2024', or 'rolling').
   * @returns A promise resolving to the aggregate metrics overview.
   */
  static async getMetricsOverview(year?: string | number): Promise<MetricsOverview> {
    const params = 
      year && String(year) !== 'rolling' 
        ? { year: String(year) } 
        : undefined;

    return await httpClient.get<MetricsOverview>(this.ENDPOINT, { params });
  }
}
