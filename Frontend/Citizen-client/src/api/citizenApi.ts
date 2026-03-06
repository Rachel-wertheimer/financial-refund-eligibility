import axios from 'axios';
import type {
  CitizenSummaryDto,
  MonthlyIncomeDto,
  CreateMonthlyIncomeDto,
  CreateRefundRequestDto,
  RefundRequestDto,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44384/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get citizen summary by identity number
export const getCitizenSummaryByIdentity = async (
  identityNumber: string
): Promise<CitizenSummaryDto> => {
  try {
    if (!identityNumber || identityNumber.trim() === '') {
      throw new Error('מספר זהות הוא שדה חובה');
    }
    const response = await apiClient.get<CitizenSummaryDto>(
      `/citizens/by-identity/${identityNumber.trim()}`
    );
    return response.data || {
      citizen: { citizenId: 0, identityNumber: '', fullName: '' },
      lastRequest: null,
      history: [],
    };
  } catch (error: any) {
    // Network error - Backend לא זמין
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על http://localhost:5133');
    }
    if (error.response?.status === 404) {
      throw new Error('אזרח לא נמצא במערכת');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'מספר זהות לא תקין');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה בטעינת נתוני האזרח');
  }
};

// Get monthly incomes by citizen ID and tax year
export const getMonthlyIncomes = async (
  citizenId: number,
  taxYear: number
): Promise<MonthlyIncomeDto[]> => {
  try {
    if (!citizenId || citizenId <= 0) {
      throw new Error('מספר אזרח לא תקין');
    }
    const response = await apiClient.get<MonthlyIncomeDto[]>(
      `/incomes/${citizenId}/${taxYear}`
    );
    return response.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה בטעינת הכנסות');
  }
};

// Create monthly income
export const createMonthlyIncome = async (
  income: CreateMonthlyIncomeDto
): Promise<MonthlyIncomeDto> => {
  try {
    if (!income.citizenId || income.citizenId <= 0) {
      throw new Error('מספר אזרח לא תקין');
    }
    if (!income.amount || income.amount <= 0) {
      throw new Error('סכום הכנסה חייב להיות גדול מ-0');
    }
    if (income.month < 1 || income.month > 12) {
      throw new Error('חודש לא תקין');
    }
    const response = await apiClient.post<MonthlyIncomeDto>('/incomes', income);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('הכנסה לחודש זה כבר קיימת');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'נתונים לא תקינים');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה בהוספת הכנסה');
  }
};

// Create citizen (registration)
export const createCitizen = async (
  identityNumber: string,
  fullName: string
): Promise<any> => {
  try {
    if (!identityNumber || identityNumber.trim() === '') {
      throw new Error('מספר זהות הוא שדה חובה');
    }
    if (!fullName || fullName.trim() === '') {
      throw new Error('שם מלא הוא שדה חובה');
    }
    const response = await apiClient.post('/citizens', {
      identityNumber: identityNumber.trim(),
      fullName: fullName.trim(),
    });
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על https://localhost:44384');
    }
    if (error.response?.status === 409) {
      throw new Error('אזרח עם מספר זהות זה כבר קיים במערכת');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'נתונים לא תקינים');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה ביצירת אזרח');
  }
};

// Create refund request
export const createRefundRequest = async (
  request: CreateRefundRequestDto
): Promise<RefundRequestDto> => {
  try {
    if (!request.citizenId || request.citizenId <= 0) {
      throw new Error('מספר אזרח לא תקין');
    }
    if (!request.taxYear || request.taxYear < 2000 || request.taxYear > 2100) {
      throw new Error('שנת מס לא תקינה');
    }
    const response = await apiClient.post<RefundRequestDto>('/refundrequests', request);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('קיימת כבר בקשה לשנת מס זו');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'נתונים לא תקינים');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה ביצירת בקשה');
  }
};
