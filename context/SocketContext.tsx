"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvent } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  subscribeToEvent: (event: SocketEvent, callback: (data: any) => void) => () => void;
  emitEvent: (event: SocketEvent, data: any) => void;
}

// Create context with default values
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within an SocketProvider');
  }
  return context;
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const newSocket = io(SOCKET_URL, {
      auth: { userId: user.id },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnected(false);

      if (reason === 'io server disconnect') {
        // The server explicitly disconnected the socket
        setTimeout(() => {
          newSocket.connect();
        }, 3000);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    newSocket.on('quiz:user_started', (data) => {
      console.log('User started quiz:', data);

      // Show toast notification with user name (with fallback)
      toast({
        title: "Quiz Started",
        description: `${data.userName || 'A user'} has started the quiz: ${data.quizTitle || 'Quiz'}`,
        variant: "default",
        duration: 5000,
      });
    });

    newSocket.on('quiz:user_completed', (data) => {
      console.log('User completed quiz:', data);

      // Show toast notification with user name (with fallback)
      toast({
        title: "Quiz Completed",
        description: `${data.userName || 'A user'} has completed the quiz: ${data.quizTitle || 'Quiz'}`,
        variant: "default",
        duration: 5000,
      });
    });

    newSocket.on('quiz:all_complete', (data) => {
      console.log('All participants completed quiz:', data);

      // Show toast notification
      toast({
        title: "Quiz Finished",
        description: `All participants have completed the quiz: ${data.quizTitle}`,
        variant: "success",
        duration: 5000,
      });
    });

    newSocket.on('quiz:invitation', (data) => {
      console.log('Quiz invitation received:', data);

      // Show toast notification with inviter name (with fallback)
      toast({
        title: "Quiz Invitation",
        description: `${data.inviterName || 'Someone'} has invited you to take the quiz: ${data.quizTitle || 'Quiz'}`,
        variant: "default",
        duration: 10000,
      });
    });

    setSocket(newSocket);

    // Handle visibility change to reconnect when tab becomes active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && newSocket && !newSocket.connected) {
        newSocket.connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, user?.id]);

  const subscribeToEvent = (event: SocketEvent, callback: (data: any) => void) => {
    if (!socket) return () => { };

    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  };

  const emitEvent = (event: SocketEvent, data: any) => {
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }

    socket.emit(event, {
      type: event,
      data,
    });
  };

  return (
    <SocketContext.Provider value={{ socket, connected, subscribeToEvent, emitEvent }}>
      {children}
    </SocketContext.Provider>
  );
}
