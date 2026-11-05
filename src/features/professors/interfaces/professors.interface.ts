import { EmergencyContact } from '@/features/members/interfaces/members.interface';

export interface Professor {
  uuid: string;
  dni: string;
  name: string;
  surname: string;
  email: string;
}

export interface AssignedStudent {
  uuid: string;
  dni: string;
  name: string;
  surname: string;
  birthDate?: string;
  phoneNumber?: string;
  profileImageUrl?: string | null;
  state?: string;
  observations?: string;
  emergencyContact?: EmergencyContact | null;
  activeRoutineName?: string;
  lastRoutineUpdate?: string;
  createdAt?: string;
}

export interface GetMyStudentsParams {
  term?: string;
  page?: number;
  limit?: number;
}
