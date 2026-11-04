import { httpClient } from '@/core/api/axios.adapter';
import {
  StudentMembershipStatus,
  StudentRoutine,
  StudentRoutineExerciseDetail,
  PublicPaymentMethod,
  StudentProfile,
  UpdateStudentProfilePayload,
} from '../interfaces/student.interface';

interface BackendRoutineDetail {
  exerciseUuid?: string;
  weekDay?: string;
  series?: number;
  repetitions?: string | number;
  restSeconds?: number;
  restTime?: string | number;
  weight?: string | number;
  suggestedWeight?: string | number;
  exercise?: {
    uuid?: string;
    name: string;
    muscleGroup?: string;
    equipment?: string;
    description?: string;
  };
}

interface BackendRoutineResponse {
  uuid?: string;
  name?: string;
  notes?: string;
  details?: StudentRoutineExerciseDetail[];
  updatedAt?: string;
  routine?: {
    uuid?: string;
    name?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  days?: Record<string, BackendRoutineDetail[]>;
}

export class StudentService {
  /**
   * Retrieves the current member's status (ACTIVE / EXPIRED) and remaining days.
   * Endpoint: GET /api/members/me/status
   */
  static async getMyStatus(): Promise<StudentMembershipStatus> {
    return await httpClient.get<StudentMembershipStatus>('/members/me/status');
  }

  /**
   * Retrieves the current assigned workout routine for the authenticated member.
   * Endpoint: GET /api/members/me/routine
   */
  static async getMyRoutine(): Promise<StudentRoutine> {
    const res = await httpClient.get<BackendRoutineResponse>('/members/me/routine');

    // If backend returns { routine, days: { LUNES: [...], ... } }
    if (res && res.days && typeof res.days === 'object') {
      const details: StudentRoutineExerciseDetail[] = [];

      for (const [weekDay, exercises] of Object.entries(res.days)) {
        if (Array.isArray(exercises)) {
          for (const item of exercises) {
            details.push({
              exerciseUuid: item.exerciseUuid || item.exercise?.uuid || '',
              weekDay: item.weekDay || weekDay,
              series: Number(item.series) || 1,
              repetitions: item.repetitions?.toString() || '10-12',
              restTime: item.restSeconds ? `${item.restSeconds}s` : (item.restTime?.toString() || '60s'),
              suggestedWeight: item.weight ? `${item.weight}kg` : (item.suggestedWeight?.toString() || ''),
              exercise: item.exercise ? {
                name: item.exercise.name,
                muscleGroup: item.exercise.muscleGroup,
                equipment: item.exercise.equipment,
                description: item.exercise.description,
              } : undefined,
            });
          }
        }
      }

      return {
        uuid: res.routine?.uuid,
        notes: res.routine?.notes,
        details,
        updatedAt: res.routine?.updatedAt || res.routine?.createdAt,
      };
    }

    // Fallback: direct StudentRoutine format
    return {
      uuid: res?.uuid,
      notes: res?.notes,
      details: Array.isArray(res?.details) ? res.details : [],
      updatedAt: res?.updatedAt,
    };
  }

  /**
   * Retrieves the gym's public payment methods (CBU, Alias, CVU, transfer data).
   * Endpoint: GET /api/gym/payment-methods/public
   */
  static async getPublicPaymentMethods(): Promise<PublicPaymentMethod[]> {
    const res = await httpClient.get<PublicPaymentMethod[] | { data: PublicPaymentMethod[] }>(
      '/gym/payment-methods/public'
    );
    if (res && 'data' in res && Array.isArray(res.data)) {
      return res.data;
    }
    return Array.isArray(res) ? res : [];
  }

  /**
   * Retrieves the profile data of the currently logged-in student.
   * Endpoint: GET /api/members/me
   */
  static async getMyProfile(): Promise<StudentProfile> {
    return await httpClient.get<StudentProfile>('/members/me');
  }

  /**
   * Updates allowed profile fields (phone, profile image, emergency contact).
   * Endpoint: PATCH /api/members/me
   */
  static async updateMyProfile(
    payload: UpdateStudentProfilePayload
  ): Promise<StudentProfile> {
    return await httpClient.patch<StudentProfile>('/members/me', payload);
  }
}
