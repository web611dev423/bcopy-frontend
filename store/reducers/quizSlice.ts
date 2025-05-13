import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Quiz } from '@/lib/types';

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

export const createNewQuiz = createAsyncThunk(
  'quiz/createNewQuiz',
  async (quiz: any) => {
    const response = await api.post('/api/quiz/quizzes', quiz);
    return response.data;
  }
);

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
);
export const fetchQuizResults = createAsyncThunk(
  'quiz/fetchQuizResults',
  async (quizId: string) => {
    const response = await api.get(`/api/quiz/results?quizId=${quizId}`);
    return response.data;
  }
);
export const fetchQuizInvitations = createAsyncThunk(
  'quiz/fetchQuizInvitations',
  async (userId: string) => {
    const response = await api.get(`/api/quiz/invitations?userId=${userId}`);
    return response.data;
  }
);

export const submitQuizResult = createAsyncThunk('quiz/submitQuizResult',
  async (result: any) => {
    const response = await api.post('/api/quiz/submit', result);
    return response.data;
  }
)

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload.data;
        state.quizzes.push(action.payload.data);
        state.error = null;
      })
      .addCase(createNewQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes';
      })
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
      .addCase(submitQuizResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitQuizResult.fulfilled, (state, action) => {
        const updatedQuiz = action.payload.data;
        const quizIndex = state.quizzes.findIndex((quiz) => quiz._id === updatedQuiz._id);
        if (quizIndex !== -1) {
          state.quizzes[quizIndex] = { ...state.quizzes[quizIndex], ...updatedQuiz };
        }
        const invitationIndex = state.quizInvitations.findIndex((invitation) => invitation._id === updatedQuiz._id);
        if (invitationIndex !== -1) {
          state.quizInvitations[invitationIndex] = { ...state.quizInvitations[invitationIndex], ...updatedQuiz };
        }

        state.error = null;
      })
      .addCase(submitQuizResult.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch quiz scorer list';
      })
      .addCase(fetchQuizResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data;
        state.error = null;
      })
      .addCase(fetchQuizResults.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch quiz results';
      })
      .addDefaultCase((state) => {
        // Handle any other actions here if needed
      }
      );
  }
});

export default quizSlice.reducer;