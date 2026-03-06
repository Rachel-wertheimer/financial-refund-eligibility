import axios from 'axios';
import type {
  RefundRequestListItemDto,
  RefundRequestDetailsDto,
  MonthlyBudgetDto,
  CalculateRequestDto,
} from '../types';
import type { LoginRequestDto, LoginResponseDto } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44384/api';

// Create axios instance with auth interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses - clear token and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      // Reload page to show login form
      if (window.location.pathname !== '/login') {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// Login API - uses base URL without /api
const loginClient = axios.create({
  baseURL: API_BASE_URL.replace('/api', ''),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials: LoginRequestDto): Promise<LoginResponseDto> => {
  try {
    if (!credentials.username || !credentials.password) {
      throw new Error('שם משתמש וסיסמה הם שדות חובה');
    }
    const response = await loginClient.post<LoginResponseDto>('/api/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('שם משתמש או סיסמה לא נכונים');
    }
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על https://localhost:44384');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה בהתחברות');
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

// Get pending refund requests
export const getPendingRequests = async (): Promise<RefundRequestListItemDto[]> => {
  try {
    const response = await apiClient.get<RefundRequestListItemDto[]>('/refundrequests/pending');
    return response.data || [];
  } catch (error: any) {
    // Network error - Backend לא זמין
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על https://localhost:44384');
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('אין הרשאה לגשת לבקשות. יש להתחבר מחדש.');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה בטעינת בקשות ממתינות');
  }
};

// Get refund request details
export const getRequestDetails = async (id: number): Promise<RefundRequestDetailsDto> => {
  try {
    if (!id || id <= 0) {
      throw new Error('מספר בקשה לא תקין');
    }
    const response = await apiClient.get<RefundRequestDetailsDto>(`/refundrequests/${id}/details`);
    if (!response.data) {
      throw new Error('לא נמצאו פרטי בקשה');
    }
    return response.data;
  } catch (error: any) {
    // Network error - Backend לא זמין
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על https://localhost:44384');
    }
    if (error.response?.status === 404) {
      throw new Error('בקשה לא נמצאה');
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('אין הרשאה לגשת לפרטי הבקשה. יש להתחבר כפקיד.');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה בטעינת פרטי הבקשה');
  }
};

// Calculate refund (triggers calculation and approval/rejection)
export const calculateRefund = async (
  requestId: number,
  calculateRequest: CalculateRequestDto
): Promise<void> => {
  try {
    if (!requestId || requestId <= 0) {
      throw new Error('מספר בקשה לא תקין');
    }
    await apiClient.post(`/refundrequests/${requestId}/calculate`, calculateRequest);
  } catch (error: any) {
    // Network error - Backend לא זמין
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על https://localhost:44384');
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('אין הרשאה לבצע חישוב. יש להתחבר כפקיד.');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'נתונים לא תקינים');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה בחישוב החזר');
  }
};

// Get monthly budget
export const getMonthlyBudget = async (
  year: number,
  month: number
): Promise<MonthlyBudgetDto> => {
  try {
    if (month < 1 || month > 12) {
      throw new Error('חודש לא תקין');
    }
    const response = await apiClient.get<MonthlyBudgetDto>(`/budget/${year}/${month}`);
    if (!response.data) {
      throw new Error('לא נמצא תקציב לחודש זה');
    }
    return response.data;
  } catch (error: any) {
    // Network error - Backend לא זמין - return default
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      return {
        year,
        month,
        totalBudget: 0,
        usedBudget: 0,
        availableBudget: 0,
      };
    }
    if (error.response?.status === 404) {
      // Return default budget if not found
      return {
        year,
        month,
        totalBudget: 0,
        usedBudget: 0,
        availableBudget: 0,
      };
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Return default instead of throwing for budget
      return {
        year,
        month,
        totalBudget: 0,
        usedBudget: 0,
        availableBudget: 0,
      };
    }
    // Return default on any other error
    return {
      year,
      month,
      totalBudget: 0,
      usedBudget: 0,
      availableBudget: 0,
    };
  }
};

// Get citizen summary by identity (for clerk to view citizen history)
export const getCitizenSummaryByIdentity = async (
  identityNumber: string
): Promise<any> => {
  try {
    if (!identityNumber || identityNumber.trim() === '') {
      throw new Error('מספר זהות הוא שדה חובה');
    }
    const response = await apiClient.get(`/citizens/by-identity/${identityNumber.trim()}`);
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על https://localhost:44384');
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

// Create citizen (for clerk to create new citizen)
export const createCitizen = async (identityNumber: string, fullName: string): Promise<any> => {
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

// Create monthly income (for clerk to add income for citizen)
export const createMonthlyIncome = async (income: {
  citizenId: number;
  taxYear: number;
  month: number;
  amount: number;
}): Promise<any> => {
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
    const response = await apiClient.post('/incomes', income);
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על https://localhost:44384');
    }
    if (error.response?.status === 409) {
      throw new Error('הכנסה לחודש זה כבר קיימת');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'נתונים לא תקינים');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה בהוספת הכנסה');
  }
};

// Create refund request (for clerk to create request for citizen)
export const createRefundRequest = async (request: {
  citizenId: number;
  taxYear: number;
}): Promise<any> => {
  try {
    if (!request.citizenId || request.citizenId <= 0) {
      throw new Error('מספר אזרח לא תקין');
    }
    if (!request.taxYear || request.taxYear < 2000 || request.taxYear > 2100) {
      throw new Error('שנת מס לא תקינה');
    }
    const response = await apiClient.post('/refundrequests', request);
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      throw new Error('לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על https://localhost:44384');
    }
    if (error.response?.status === 409) {
      throw new Error('קיימת כבר בקשה לשנת מס זו');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'נתונים לא תקינים');
    }
    if (error.response?.status === 500) {
      throw new Error(error.response?.data?.message || 'שגיאה ביצירת בקשה. ייתכן שהאזרח לא קיים או שיש בעיה אחרת.');
    }
    throw new Error(error.response?.data?.message || error.message || 'שגיאה ביצירת בקשה');
  }
};
