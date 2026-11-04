import { useQuery } from '@tanstack/react-query';
import { ProfessorsService } from '../services/professors.service';
import { GetMyStudentsParams } from '../interfaces/professors.interface';

export const useMyStudents = (params: GetMyStudentsParams = {}) => {
  return useQuery({
    queryKey: ['my-students', params],
    queryFn: () => ProfessorsService.getMyStudents(params),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useProfessors = () => {
  return useQuery({
    queryKey: ['professors'],
    queryFn: () => ProfessorsService.getProfessors(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
