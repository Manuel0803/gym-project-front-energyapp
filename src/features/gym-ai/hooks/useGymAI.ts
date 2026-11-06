import { useMutation, useQuery } from '@tanstack/react-query';
import { GymAIService } from '../services/gym-ai.service';

export const useGymAIExamples = (enabled: boolean) => {
  return useQuery({
    queryKey: ['gym-ai-examples'],
    queryFn: () => GymAIService.getExamples(),
    enabled,
    staleTime: Infinity,
  });
};

export const useAskGymAI = () => {
  return useMutation({
    mutationFn: (query: string) => GymAIService.ask(query),
  });
};

export const useClearGymAIHistory = () => {
  return useMutation({
    mutationFn: () => GymAIService.clearHistory(),
  });
};
