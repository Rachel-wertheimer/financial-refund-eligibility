// Types for Clerk Client

export * from './auth';

export const RequestStatus = {
    Pending: 0,
    Calculated: 1,
    Approved: 2,
    Rejected: 3,
  } as const;
  
  export type RequestStatus =
    (typeof RequestStatus)[keyof typeof RequestStatus];

export interface RefundRequestListItemDto {
  id: number;
  taxYear: number;
  status: string;
  createdAt: string;
  citizenId: number;
  citizenFullName: string;
  citizenIdentityNumber: string;
}

export interface IncomeMonthAmountDto {
  month: number;
  amount: number;
}

export interface IncomeYearGroupDto {
  taxYear: number;
  monthlyIncomes: IncomeMonthAmountDto[];
}

export interface PastRefundRequestDto {
  id: number;
  taxYear: number;
  status: string;
  approvedAmount?: number;
}

export interface CitizenInRequestDto {
  citizenId: number;
  identityNumber: string;
  fullName: string;
}

export interface RefundRequestDto {
  id: number;
  taxYear: number;
  status: RequestStatus;
  calculatedAmount?: number;
  approvedAmount?: number;
}

export interface RefundRequestDetailsDto {
  request: RefundRequestDto;
  citizen: CitizenInRequestDto;
  incomesByYear: IncomeYearGroupDto[];
  pastRequests: PastRefundRequestDto[];
}

export interface MonthlyBudgetDto {
  year: number;
  month: number;
  totalBudget: number;
  usedBudget: number;
  availableBudget: number;
}

export interface CalculateRequestDto {
  clerkId: number;
  approve: boolean;
}

// Citizen types for clerk
export interface CitizenDto {
  citizenId: number;
  identityNumber: string;
  fullName: string;
}

export interface CitizenSummaryDto {
  citizen: CitizenDto;
  lastRequest: RefundRequestDto | null;
  history: PastRefundRequestDto[];
}

export interface CreateCitizenDto {
  identityNumber: string;
  fullName: string;
}

export interface CreateMonthlyIncomeDto {
  citizenId: number;
  taxYear: number;
  month: number;
  amount: number;
}

export interface CreateRefundRequestDto {
  citizenId: number;
  taxYear: number;
}
