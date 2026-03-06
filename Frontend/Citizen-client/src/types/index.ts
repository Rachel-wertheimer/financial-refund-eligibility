// Types for Citizen Client

export enum RequestStatus {
  Pending = 0,
  Calculated = 1,
  Approved = 2,
  Rejected = 3,
}

export interface CitizenDto {
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

export interface PastRefundRequestDto {
  id: number;
  taxYear: number;
  status: string;
  approvedAmount?: number;
}

export interface CitizenSummaryDto {
  citizen: CitizenDto;
  lastRequest: RefundRequestDto | null;
  history: PastRefundRequestDto[];
}

export interface MonthlyIncomeDto {
  id: number;
  citizenId: number;
  taxYear: number;
  month: number;
  amount: number;
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
