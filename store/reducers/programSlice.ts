import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
// Define your data types
interface ProgramState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgramState = {
  items: [],
  loading: false,
  error: null,
};

// Create async thunk for fetching data
export const fetchPrograms = createAsyncThunk(
  'programs/fetchPrograms',
  async () => {
    const response = await api.get('/programs');
    return response.data;
  }
);

export const copyProgram = createAsyncThunk(
  'programs/copyProgram',
  async (programId: string) => {
    const response = await api.put(`/programs/${programId}/copy`);
    return response.data;
  }
);

const programSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.error = null;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(copyProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(copyProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(copyProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default programSlice.reducer;