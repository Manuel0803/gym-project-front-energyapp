import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GymsService } from '../services/gyms.service';
import { UpdateGymPayload } from '../interfaces/gym.interface';

/**
 * Fetches and caches the gym's public/profile data.
 * Optimized with a long stale time since gym details rarely change.
 * 
 * @param term - The identifier for the gym (e.g., subdomain).
 */
export const useGym = (term?: string) => {
  return useQuery({
    queryKey: ['gym', term],
    queryFn: () => GymsService.getByTerm(term!),
    enabled: !!term,
    staleTime: 1000 * 60 * 60,
    retry: (failureCount, error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Mutation hook to update the gym's information.
 * Automatically invalidates the gym cache to refresh the UI on success.
 */
export const useUpdateGym = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGymPayload }) =>
      GymsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym'] });
    },
  });
}
