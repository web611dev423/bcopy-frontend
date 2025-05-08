'use client';

import { useState, useEffect } from 'react';
import {
  Quiz,
  Question,
  QuizResult,
  QuizInvitation
} from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import {
  sendQuizInvitation,
  startQuiz as socketStartQuiz,
  completeQuiz as socketCompleteQuiz,
  subscribeToEvent
} from '@/lib/socket';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export function useQuiz(userId: string) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const { toast } = useToast();


  // // Load specific quiz
  const loadQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      // const quiz = await getQuiz(quizId);
      const quiz: Quiz = await api.get(`/api/quiz/quizzes/${quizId}`);
      setCurrentQuiz(quiz);
      setError(null);
      return quiz;
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError('Failed to load quiz');
      toast({
        title: 'Error',
        description: 'Failed to load quiz',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new quiz with questions from OpenTDB
  const createNewQuiz = async (
    title: string,
    description: string,
    mode: 'direct' | 'group' | 'solo',
    questionsConfig: {
      amount: number;
      category?: number;
      difficulty?: 'easy' | 'medium' | 'hard';
      type?: 'multiple' | 'boolean';
    }
  ) => {
    try {
      // Validate inputs
      if (!title || !description || !questionsConfig.amount) {
        throw new Error('Invalid input: Title, description, and question amount are required.');
      }

      setLoading(true);

      const newQuiz = await api.post('/api/quiz/quizzes', {
        amount: questionsConfig.amount,
        category: questionsConfig.category,
        difficulty: questionsConfig.difficulty,
        type: questionsConfig.type,
        creatorId: user?.id,
        participants: [{ userId: user?.id, status: 'accepted' }],
        createdAt: new Date().toISOString(),
        mode,
        title,
        description,
      });

      if (!newQuiz) {
        throw new Error('Failed to create quiz. Please try again.');
      }

      setQuizzes((prev) => [...prev, newQuiz.data]);
      setCurrentQuiz(newQuiz.data);

      toast({
        title: 'Success',
        description: 'Quiz created successfully',
      });

      return newQuiz;
    } catch (err: any) {
      console.error('Error creating quiz:', err.message || err);
      setError(err.message || 'Failed to create quiz');
      toast({
        title: 'Error',
        description: err.message || 'Failed to create quiz',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  const fetchQuizResults = async (quizId: string) => {
    try {
      setLoading(true);
      const quizResults = await api.get(`/api/quiz/results?quizId=${quizId}`);

      setResults(quizResults.data);
      return quizResults.data;
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load results');
      return [];
    } finally {
      setLoading(false);
    }
  };
  // Challenge users to a quiz
  // const challengeUsers = async (quizId: string, userIds: string[]) => {
  //   try {
  //     setLoading(true);

  //     // Create invitations through API
  //     const invitations = await Promise.all(
  //       userIds.map(inviteeId =>
  //         sendInvitation({
  //           quizId,
  //           inviterId: userId,
  //           inviteeId,
  //           status: 'pending',
  //           createdAt: new Date().toISOString()
  //         })
  //       )
  //     );

  //     // Send real-time invitations through socket
  //     sendQuizInvitation(quizId, userIds);

  //     toast({
  //       title: 'Success',
  //       description: 'Invitations sent successfully',
  //     });

  //     return invitations;
  //   } catch (err) {
  //     console.error('Error sending invitations:', err);
  //     setError('Failed to send invitations');
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to send invitations',
  //       variant: 'destructive',
  //     });
  //     return [];
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Start quiz and track time
  const startQuiz = (quizId: string) => {
    try {
      const startTime = new Date().toISOString();
      socketStartQuiz(quizId, userId);

      toast({
        title: 'Quiz Started',
        description: 'Your timer has started. Good luck!',
      });

      return startTime;
    } catch (err) {
      console.error('Error starting quiz:', err);
      toast({
        title: 'Error',
        description: 'Failed to start quiz',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Submit quiz results
  // const submitResult = async (
  //   quizId: string,
  //   score: number,
  //   totalQuestions: number,
  //   startedAt: string,
  //   answers: any[]
  // ) => {
  //   try {
  //     setLoading(true);
  //     const completedAt = new Date().toISOString();
  //     const startTime = new Date(startedAt).getTime();
  //     const endTime = new Date(completedAt).getTime();
  //     const timeElapsedMs = endTime - startTime;

  //     const result = await submitQuizResult({
  //       userId,
  //       quizId,
  //       score,
  //       totalQuestions,
  //       startedAt,
  //       completedAt,
  //       timeElapsedMs
  //     });

  //     // Notify other participants via socket
  //     socketCompleteQuiz(quizId, userId, {
  //       score,
  //       timeElapsedMs,
  //       answers
  //     });

  //     toast({
  //       title: 'Quiz Completed',
  //       description: `You scored ${score}/${totalQuestions} in ${Math.floor(timeElapsedMs / 1000)} seconds`,
  //     });

  //     return result;
  //   } catch (err) {
  //     console.error('Error submitting results:', err);
  //     setError('Failed to submit results');
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to submit quiz results',
  //       variant: 'destructive',
  //     });
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch quiz results
  //  //

  //     // Socket event subscriptions
  //     const unsubscribeInvitation = subscribeToEvent('quiz:invitation', (data) => {
  //       toast({
  //         title: 'New Quiz Invitation',
  //         description: 'You have been invited to a quiz challenge!',
  //       });
  //     });

  //     const unsubscribeComplete = subscribeToEvent('quiz:all_complete', (data) => {
  //       if (data.quizId && currentQuiz?.id === data.quizId) {
  //         toast({
  //           title: 'Quiz Challenge Complete',
  //           description: 'All participants have completed the quiz. View results now!',
  //         });
  //         fetchQuizResults(data.quizId);
  //       }
  //     });

  //     return () => {
  //       unsubscribeInvitation();
  //       unsubscribeComplete();
  //     };
  //   }, [userId, currentQuiz?.id]);

  return {
    quizzes,
    currentQuiz,
    loading,
    error,
    results,
    createNewQuiz,
    loadQuiz,
    // challengeUsers,
    startQuiz,
    // submitResult,
    fetchQuizResults,
    // fetchUserQuizzes,
  };
}