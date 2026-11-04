import { Payment } from '@/features/payments/interfaces/payments.interface';
import { Plan } from '@/features/plans/interfaces/plan.interface';

export interface Subscription {
  uuid: string;
  planUuid: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  plan?: Plan;
}

export interface EmergencyContact {
  uuid?: string;
  name: string;
  phoneNumber: string;
  relationship: string;
}

export interface MemberUser {
  uuid?: string;
  dni?: string;
  name?: string;
  surname?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface Member {
  uuid: string;
  user?: MemberUser; // V2 atomic User linkage
  professorAssignedUuid?: string | null;
  professorAssigned?: {
    uuid: string;
    name: string;
    surname: string;
    email?: string;
  } | null;
  dni: string;
  name: string;
  surname: string;
  birthDate: string;
  phoneNumber?: string;
  profileImageUrl?: string | null;
  state: string;
  observations?: string;
  emergencyContact?: EmergencyContact;
  subscriptions?: Subscription[];
  payments?: Payment[];
  createdAt?: string;
}

export interface CreateMemberPayload {
  dni: string;
  name: string;
  surname: string;
  birthDate: string;
  phoneNumber?: string;
  professorAssignedUuid?: string | null;
  state?: string;
  observations?: string;
  profileImageUrl?: string | null;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  } | null;
}

export type UpdateMemberPayload = Partial<CreateMemberPayload>;

export type MemberSortBy = 'name' | 'surname' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export type SortOption =
  | 'default'
  | 'createdAt_desc'
  | 'name_asc'
  | 'name_desc'
  | 'surname_asc'
  | 'surname_desc';

export interface GetMembersParams {
  page?: number;
  limit?: number;
  term?: string;
  state?: string;
  planId?: string;
  sortBy?: MemberSortBy;
  order?: SortOrder;
  initial?: string;
}

export interface MemberListProps {
  name: string;
  memberID: string;
  uuid: string;
  status: 'Activo' | 'Vencido' | 'Inactivo' | string;
  phoneNumber?: string;
  profileImageUrl?: string | null;
  observations?: string;
  planName: string;
  birthdate?: string;
}

export interface MemberProfileCardProps {
  member: Member;
  displayStatus: string;
  safeStatusStyles: string;
  defaultAmount: number;
}

export interface MemberDetailClientProps {
  id: string;
}

export interface DeleteMemberButtonProps {
  uuid: string;
  name: string;
  onDeleted: () => void;
}

export interface MemberRowActionsProps {
  uuid: string;
  name: string;
  member?: Member;
}

export interface ImportMembersResponse {
  success: number;
  errors: number;
  totalProcessed?: number;
  duplicatedDnis?: string[];
  total?: number;
}
