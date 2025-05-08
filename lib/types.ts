// Common types used throughout the application
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Question {
  id: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizInvitation {
  id: string;
  quizId: string;
  inviterId: string;
  inviteeId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface QuizResult {
  userId: string;
  score: number;
  totalQuestions: number;
  startedAt: string;
  completedAt: string;
  timeElapsedMs: number;
}

export interface Quiz {
  _id: string;
  creatorId: string;
  title: string;
  description?: string;
  questions: Question[];
  mode: 'direct' | 'group' | 'solo';
  participants: {
    userId: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    result?: QuizResult;
  }[];
  createdAt: string;
  expiresAt?: string;
}

export interface QuizSession {
  quizId: string;
  userId: string;
  currentQuestionIndex: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
  startedAt?: string;
  completedAt?: string;
}

// Socket.io event types
export type SocketEvent =
  | 'quiz:invitation'
  | 'quiz:invitation:response'
  | 'quiz:start'
  | 'quiz:complete'
  | 'quiz:all_complete';

export interface SocketPayload {
  type: SocketEvent;
  data: any;
}