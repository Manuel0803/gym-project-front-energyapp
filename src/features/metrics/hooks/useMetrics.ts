import { useQuery } from '@tanstack/react-query';
import { MetricsService } from '../services/metrics.service';

/**
 * Hook to fetch and cache the global metrics and analytics overview.
 * Automatically refetches every 5 minutes to keep dashboard data fresh.
 * 
 * @param year - Optional year to filter the data (e.g., 2024, '2024', or 'rolling').
 * @returns React Query object containing the metrics overview data, loading state, and errors.
 */
export const useMetricsOverview = (year?: string | number) => {
  return useQuery({
    queryKey: ['metrics', 'overview', String(year || 'rolling')],
    queryFn: () => MetricsService.getMetricsOverview(year),
    staleTime: 1000 * 60 * 5, 
    refetchInterval: 1000 * 60 * 5,
  });
};
