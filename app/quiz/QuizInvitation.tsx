'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Users, User, BookOpen } from 'lucide-react';
import { QuizInvitation as QuizInvitationType } from '@/lib/types';
import { useSocket } from '@/context/SocketContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type QuizInvitationProps = {
  invitation: QuizInvitationType;
  quizId: string;
  quizTitle: string;
  inviterName: string;
  mode: 'direct' | 'group' | 'solo';
  questionCount: number;
  onResponseSubmitted: () => void;
};

export default function QuizInvitation({
  invitation,
  quizId,
  quizTitle,
  inviterName,
  mode,
  questionCount,
  onResponseSubmitted
}: QuizInvitationProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useAuth();
  const { emitEvent } = useSocket();
  const handleResponse = async (status: 'accepted' | 'declined') => {
    try {
      if (quizId && quizId !== '')
        emitEvent('quiz:invitation:response', { quizId, status });
      // respondToQuizInvitation(quizId, status);
      toast({
        title: status === 'accepted' ? 'Invitation Accepted' : 'Invitation Declined',
        description: status === 'accepted'
          ? 'You can now participate in the quiz'
          : 'You have declined the invitation',
      });

      onResponseSubmitted();
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to respond to invitation',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'direct':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'group':
        return <Users className="h-5 w-5 text-purple-500" />;
      case 'solo':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getModeBadge = () => {
    switch (mode) {
      case 'direct':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Direct Challenge
          </Badge>
        );
      case 'group':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Group Challenge
          </Badge>
        );
      case 'solo':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            Solo Practice
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full mb-4 overflow-hidden border-l-4 border-l-primary animate-fadeIn">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {getModeIcon()}
              {quizTitle}
            </CardTitle>
            <CardDescription className="mt-1">
              Invited by {inviterName}
            </CardDescription>
          </div>
          {getModeBadge()}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{questionCount} questions</span>
          <span>•</span>
          <span>{invitation.status}</span>
          <span>Individual timer</span>
          {mode === 'group' && (
            <>
              <span>•</span>
              <span>Leaderboard</span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 border-t bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleResponse('declined')}
          disabled={isSubmitting}
          className="text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Decline
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => handleResponse('accepted')}
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 transition-colors"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Accept
        </Button>
      </CardFooter>
    </Card>

  );
}