import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
// Define your data types
interface FeedbackState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  items: [],
  loading: false,
  error: null,
};

// Create async thunk for fetching data
export const newContributions = createAsyncThunk(
  'contributions/newContributions',
  async (data: any) => {
    console.log("data", data);
    const response = await api.post('/api/contributions/new', data);
    return response.data;
  }
);

const contributionSlice = createSlice({
  name: 'contribution',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newContributions.pending, (state) => {
        state.loading = true;
      })
      .addCase(newContributions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.error = null;
      })
      .addCase(newContributions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default contributionSlice.reducer;