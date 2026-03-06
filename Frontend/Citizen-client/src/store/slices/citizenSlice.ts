import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getCitizenSummaryByIdentity } from '../../api/citizenApi';
import type { CitizenSummaryDto } from '../../types';

interface CitizenState {
  citizenSummary: CitizenSummaryDto | null;
  identityNumber: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CitizenState = {
  citizenSummary: null,
  identityNumber: null,
  loading: false,
  error: null,
};

// Thunk to fetch citizen data by identity number
export const fetchCitizenByIdentity = createAsyncThunk(
  'citizen/fetchByIdentity',
  async (identityNumber: string, { rejectWithValue }) => {
    try {
      const data = await getCitizenSummaryByIdentity(identityNumber);
      return { data, identityNumber };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch citizen data'
      );
    }
  }
);

const citizenSlice = createSlice({
  name: 'citizen',
  initialState,
  reducers: {
    clearCitizenData(state) {
      state.citizenSummary = null;
      state.identityNumber = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitizenByIdentity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCitizenByIdentity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.citizenSummary = {
            citizen: action.payload.data.citizen || {
              citizenId: 0,
              identityNumber: action.payload.identityNumber || '',
              fullName: '',
            },
            lastRequest: action.payload.data.lastRequest || null,
            history: action.payload.data.history || [],
          };
        }
        state.identityNumber = action.payload?.identityNumber || null;
      })
      .addCase(fetchCitizenByIdentity.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'שגיאה בטעינת נתונים';
        state.citizenSummary = null;
      });
  },
});

export const { clearCitizenData, clearError } = citizenSlice.actions;

export default citizenSlice.reducer;