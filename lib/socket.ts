// Socket.io client for real-time communication
import { io, Socket } from 'socket.io-client';
import { SocketEvent, SocketPayload } from './types';

let socket: Socket | null = null;

export const initializeSocket = (userId: string) => {

  const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!socket && userId) {
    socket = io(SOCKET_URL, {
      auth: { userId },
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToEvent = (event: SocketEvent, callback: (data: any) => void) => {
  if (!socket) return () => { };

  socket.on(event, callback);

  return () => {
    socket?.off(event, callback);
  };
};

export const emitEvent = (event: SocketEvent, data: any) => {
  if (!socket) {
    console.error('Socket not initialized');
    return;
  }

  const payload: SocketPayload = {
    type: event,
    data,
  };

  socket.emit(event, payload);
};

// Specialized socket event emitters for specific quiz actions
export const sendQuizInvitation = (quizId: string, inviteeIds: string[]) => {
  emitEvent('quiz:invitation', { quizId, inviteeIds });
};

export const respondToQuizInvitation = (quizId: string, status: 'accepted' | 'declined') => {
  emitEvent('quiz:invitation:response', { quizId, status });
};

export const startQuiz = (quizId: string, userId: string) => {
  emitEvent('quiz:start', { quizId, userId, startedAt: new Date().toISOString() });
};

export const completeQuiz = (quizId: string, userId: string, result: any) => {
  emitEvent('quiz:complete', {
    quizId,
    userId,
    completedAt: new Date().toISOString(),
    result
  });
};