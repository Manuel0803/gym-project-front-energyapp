export interface MetricValue {
  total: number;
  trend?: number;
  newToday?: number;
  newThisMonth?: number;
}

export interface MemberTrajectoryItem {
  month: string;
  newMembers: number;
  churnedMembers: number;
}

export interface RevenueTrajectoryItem {
  month: string;
  amount: number;
}

export interface StatusDistribution {
  active: number;
  suspended: number;
  inactive: number;
}

export interface UpcomingRenewal {
  id: string;
  initials: string;
  name: string;
  plan: string;
  daysLeft: number;
  isUrgent: boolean;
}

export interface UpcomingBirthday {
  id: string;
  name: string;
  initials: string;
  profileImageUrl?: string | null;
  daysLeft: number;
  isToday: boolean;
  birthDate: string;
}

export interface PlanDistributionItem {
  name: string;
  count: number;
  percentage: number;
}

export interface MetricsOverview {
  activeMembers: MetricValue;
  monthlyRevenue: MetricValue;
  overdueAccounts: MetricValue;
  statusDistribution?: StatusDistribution;
  upcomingRenewals: UpcomingRenewal[];
  upcomingBirthdays: UpcomingBirthday[];
  revenueTrajectory: RevenueTrajectoryItem[];
  membersTrajectory?: MemberTrajectoryItem[];
  planDistribution?: PlanDistributionItem[];
}
