import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Quiz } from '@/lib/types';
import { create } from 'domain';

interface quizState {
  quizzes: any[],
  scorers: any[],
  currentQuiz: Quiz | null,
  loading: boolean,
  error: string | null,
  quizLoading: boolean,
  results: any[],
  quizInvitations: any[],
  quizInvitationsLoading: boolean,
  quizInvitationsError: string | null,
}

const initialState: quizState = {
  quizzes: [],
  scorers: [],
  currentQuiz: null,
  loading: false,
  error: null,
  quizLoading: false,
  results: [],
  quizInvitations: [],
  quizInvitationsLoading: false,
  quizInvitationsError: null,
}

export const fetchUserQuizees = createAsyncThunk(
  'quiz/fetchuserquizzes',
  async (userId: string) => {
    const response = await api.get(`/api/quiz/quizzes?userId=${userId}`);
    return response.data;
  }
);

export const fetchQuizScorerList = createAsyncThunk(
  'quiz/fetchQuizScorerList',
  async () => {
    const response = await api.get('/api/quiz/userlist');
    return response.data;
  }
)

export const fetchQuizInvitations = createAsyncThunk(
  'quiz/fetchQuizInvitations',
  async (userId: string) => {
    const response = await api.get(`/api/quiz/invitations?userId=${userId}`);
    return response.data;
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserQuizees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserQuizees.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload.data;
        state.error = null;
      })
      .addCase(fetchUserQuizees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes';
      })
      .addCase(fetchQuizScorerList.pending, (state) => {
        state.quizLoading = true;
      })
      .addCase(fetchQuizScorerList.fulfilled, (state, action) => {
        state.quizLoading = false;
        state.scorers = action.payload.data;
        state.error = null;
      }
      )
      .addCase(fetchQuizScorerList.rejected, (state, action) => {
        state.quizLoading = false;
        state.error = action.error.message || 'Failed to fetch quiz scorer list';
      }
      )
      .addCase(fetchQuizInvitations.pending, (state) => {
        state.quizInvitationsLoading = true;
      })
      .addCase(fetchQuizInvitations.fulfilled, (state, action) => {
        state.quizInvitationsLoading = false;
        state.quizInvitations = action.payload.data;
        state.error = null;
      }
      )
      .addCase(fetchQuizInvitations.rejected, (state, action) => {
        state.quizInvitationsLoading = false;
        state.quizInvitationsError = action.error.message || 'Failed to fetch quiz invitations';
      }
      )
      .addDefaultCase((state) => {
        // Handle any other actions here if needed
      }
      );
  }
});

export default quizSlice.reducer;