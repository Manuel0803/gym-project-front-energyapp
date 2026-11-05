export type StudentMembershipStatusType = 'ACTIVE' | 'EXPIRED' | string;

export interface StudentMembershipStatus {
  status: StudentMembershipStatusType;
  daysRemaining: number;
  planName?: string;
  expirationDate?: string;
  startDate?: string;
  price?: number;
}

export interface StudentRoutineExerciseDetail {
  exerciseUuid: string;
  weekDay: string;
  series: number;
  repetitions: string;
  restTime: string;
  suggestedWeight?: string;
  exercise?: {
    name: string;
    muscleGroup?: string;
    equipment?: string;
    description?: string;
  };
}

export interface StudentRoutine {
  uuid?: string;
  notes?: string;
  details: StudentRoutineExerciseDetail[];
  updatedAt?: string;
}

export interface PublicPaymentMethod {
  uuid?: string;
  type?: string;
  title: string;
  bankName?: string;
  cbu?: string;
  cvu?: string;
  alias?: string;
  accountHolder?: string;
  cuit?: string;
  qrImageUrl?: string;
  instructions?: string;
}

export interface StudentProfileEmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface StudentProfile {
  uuid: string;
  dni: string;
  name: string;
  surname: string;
  email?: string;
  state?: string;
  phoneNumber?: string;
  profileImageUrl?: string | null;
  emergencyContact?: StudentProfileEmergencyContact | null;
}

export interface UpdateStudentProfilePayload {
  phoneNumber?: string;
  profileImageUrl?: string | null;
  emergencyContact?: StudentProfileEmergencyContact | null;
}
