import { createSlice, createAsyncThunk, type PayloadAction,  } from '@reduxjs/toolkit';
import {
  getPendingRequests,
  getRequestDetails,
  calculateRefund,
  getMonthlyBudget,
} from '../../api/clerkApi';
import type {
  RefundRequestListItemDto,
  RefundRequestDetailsDto,
  MonthlyBudgetDto,
  CalculateRequestDto,
} from '../../types';

interface ClerkState {
  pendingRequests: RefundRequestListItemDto[];
  selectedRequestDetails: RefundRequestDetailsDto | null;
  currentBudget: MonthlyBudgetDto | null;
  loading: boolean;
  error: string | null;
  selectedRequestId: number | null;
}

const initialState: ClerkState = {
  pendingRequests: [],
  selectedRequestDetails: null,
  currentBudget: null,
  loading: false,
  error: null,
  selectedRequestId: null,
};

// Async thunks
export const fetchPendingRequests = createAsyncThunk(
  'clerk/fetchPendingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getPendingRequests();
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch pending requests'
      );
    }
  }
);

export const fetchRequestDetails = createAsyncThunk(
  'clerk/fetchRequestDetails',
  async (requestId: number, { rejectWithValue }) => {
    try {
      const data = await getRequestDetails(requestId);
      return { data, requestId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch request details'
      );
    }
  }
);

export const calculateRefundRequest = createAsyncThunk(
  'clerk/calculateRefund',
  async (
    { requestId, calculateRequest }: { requestId: number; calculateRequest: CalculateRequestDto },
    { rejectWithValue }
  ) => {
    try {
      await calculateRefund(requestId, calculateRequest);
      return { requestId, approve: calculateRequest.approve };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to calculate refund'
      );
    }
  }
);

export const fetchMonthlyBudget = createAsyncThunk(
  'clerk/fetchMonthlyBudget',
  async ({ year, month }: { year: number; month: number }, { rejectWithValue }) => {
    try {
      const data = await getMonthlyBudget(year, month);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch monthly budget'
      );
    }
  }
);

const clerkSlice = createSlice({
  name: 'clerk',
  initialState,
  reducers: {
    setSelectedRequestId(state, action: PayloadAction<number | null>) {
      state.selectedRequestId = action.payload;
      if (!action.payload) {
        state.selectedRequestDetails = null;
      }
    },
    clearError(state) {
      state.error = null;
    },
    clearSelectedRequest(state) {
      state.selectedRequestDetails = null;
      state.selectedRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pending requests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload || [];
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        // Don't set error for 401 - it will trigger login redirect
        if (!errorMessage?.includes('הרשאה') && !errorMessage?.includes('401')) {
          state.error = errorMessage || 'שגיאה בטעינת בקשות ממתינות';
        }
        state.pendingRequests = [];
      })
      // Fetch request details
      .addCase(fetchRequestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestDetails.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.selectedRequestDetails = action.payload.data;
          state.selectedRequestId = action.payload.requestId;
        }
      })
      .addCase(fetchRequestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'שגיאה בטעינת פרטי בקשה';
        state.selectedRequestDetails = null;
      })
      // Calculate refund
      .addCase(calculateRefundRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateRefundRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the request from pending list if approved/rejected
        state.pendingRequests = state.pendingRequests.filter(
          (req) => req.id !== action.payload.requestId
        );
        // Optionally refetch details to get updated status
      })
      .addCase(calculateRefundRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch monthly budget
      .addCase(fetchMonthlyBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyBudget.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentBudget = {
            year: action.payload.year || new Date().getFullYear(),
            month: action.payload.month || new Date().getMonth() + 1,
            totalBudget: Number(action.payload.totalBudget || 0),
            usedBudget: Number(action.payload.usedBudget || 0),
            availableBudget: Number(action.payload.availableBudget || 0),
          };
        }
      })
      .addCase(fetchMonthlyBudget.rejected, (state) => {
        state.loading = false;
        // Don't set error for budget - it's optional
        // Set default budget if fetch fails
        const now = new Date();
        state.currentBudget = {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          totalBudget: 0,
          usedBudget: 0,
          availableBudget: 0,
        };
      });
  },
});

export const { setSelectedRequestId, clearError, clearSelectedRequest } = clerkSlice.actions;
export default clerkSlice.reducer;
