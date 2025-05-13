'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PlusCircle,
  Trophy,
  BookOpen,
  Users,
  User,
  Bell,
  Calendar
} from 'lucide-react';
import QuizCreator from './QuizCreator';
import QuizInvitation from './QuizInvitation';
import QuizTaker from './QuizTaker';

import QuizResults from './QuizResults';
import ChallengeFriends from './ChallengeFriends';
import { Quiz, QuizInvitation as QuizInvitationType } from '@/lib/types';
import { useSocket } from '@/context/SocketContext';
import { fetchQuizScorerList, fetchUserQuizees } from '@/store/reducers/quizSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

import { fetchQuizInvitations } from '@/store/reducers/quizSlice';


export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userQuizzes = useAppSelector((state) => state.quizzes.quizzes);
  const invitations = useAppSelector((state) => state.quizzes.quizInvitations);
  const scorers = useAppSelector((state) => state.quizzes.scorers);
  const [activeView, setActiveView] = useState<string>('quizzes');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizState, setQuizState] = useState<'creating' | 'inviting' | 'taking' | 'results' | null>(null);

  // Use the socket context instead of direct socket functions
  const { subscribeToEvent } = useSocket();

  useEffect(() => {
    if (isAuthenticated && user && user.id !== '') {
      dispatch(fetchUserQuizees(user.id));
      dispatch(fetchQuizInvitations(user.id));
      dispatch(fetchQuizScorerList());
    }
  }, [dispatch, isAuthenticated, user])

  const handleQuizStart = async (quizId: string) => {

    const quiz = await userQuizzes.filter((q) => q._id === quizId)[0];

    if (quiz) {
      setSelectedQuiz(quiz);
      setQuizState('taking');
    }
  }

  const handleInvitedQuizStart = async (quizId: string) => {
    const quiz = await invitations.filter((q) => q._id === quizId)[0];

    if (quiz) {
      setSelectedQuiz(quiz);
      setQuizState('taking');
    }
  }

  // Initialize socket connection and fetch pending invitations
  useEffect(() => {
    if (isAuthenticated && user) {
      const unsubscribe = subscribeToEvent('quiz:invitation', (data) => {
        if (isAuthenticated) {
          dispatch(fetchQuizInvitations(user.id));
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isAuthenticated, user, dispatch, subscribeToEvent]);

  // Handle quiz creation
  const handleQuizCreated = (quiz: Quiz) => {
    setSelectedQuiz(quiz);

    if (quiz.mode === 'solo') {
      setQuizState('taking');
    } else {
      setQuizState('inviting');
    }
  };

  // Handle invites sent
  const handleChallengeComplete = () => {
    setQuizState('taking');
  };

  // Handle quiz completion
  const handleQuizComplete = () => {
    setQuizState('results');
  };
  const handleViewResult = (quiz: any) => {
    setSelectedQuiz(quiz);
    setQuizState('results');
  }
  // Handle response to invitation
  const handleInvitationResponse = async () => {
    await dispatch(fetchQuizInvitations(user?.id || ''));
  };

  // Reset to home view
  const handleGoHome = () => {
    setSelectedQuiz(null);
    setQuizState(null);
    setActiveView('quizzes');
  };

  // Play again (create new quiz)
  const handlePlayAgain = () => {
    setSelectedQuiz(null);
    setQuizState('creating');
  };

  // Get mode icon
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'direct':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'group':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'solo':
        return <BookOpen className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  const getUserInvitationStatus = (invitation: any) => {
    const userId = user?.id || '';
    const temp = invitation.participants.find((participant: any) => participant.userId === userId);
    return temp?.status;
  }

  const IsUserQuizStarted = (quiz: any) => {
    const userId = user?.id || '';
    if (quiz?.participants.find((participant: any) => participant.userId === userId)?.status == 'completed')
      return true;
    else return false;
  }

  return (<>
    <Header />
    <div className="flex w-full justify-center min-h-screen pt-12 p-4">
      <div className="container max-w-8xl py-8 w-full">
        {quizState === 'taking' && selectedQuiz && (
          <div className="container max-w-full py-8 flex justify-center">
            <QuizTaker
              userId={user?.id || ''}
              quiz={selectedQuiz}
              onComplete={handleQuizComplete}
              onGoHome={handleGoHome}
            />
          </div>
        )}

        {quizState === 'results' && selectedQuiz && (
          <div className="container max-w-full py-8 flex justify-center">
            <QuizResults
              userId={user?.id || ''}
              quiz={selectedQuiz}
              onPlayAgain={handlePlayAgain}
              onGoHome={handleGoHome}
            />
          </div>
        )}
        {quizState !== 'results' && quizState !== 'taking' && (
          <><div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quiz Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Challenge friends or practice your knowledge
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* {invitations.length > 0 && (
                <Badge variant="destructive" className="mr-1">
                  {invitations.length}
                </Badge>
              )} */}
              <Button onClick={() => setQuizState('creating')} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </div>
          </div><Tabs defaultValue="quizzes" value={activeView} onValueChange={setActiveView}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="quizzes" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  My Quizzes
                </TabsTrigger>
                <TabsTrigger value="invitedquizzes" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Invited Quizzes
                </TabsTrigger>
                <TabsTrigger value="invitations" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Invitations
                  {invitations.filter(invitation => getUserInvitationStatus(invitation) === 'pending').length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {invitations.filter(invitation => getUserInvitationStatus(invitation) === 'pending').length}
                    </Badge>
                  )}
                </TabsTrigger>
                {/* <TabsTrigger value="history" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="quizzes" className="mt-0">
                {userQuizzes && userQuizzes.length > 0 ? (
                  <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {userQuizzes.map((quiz) => (
                      <Card key={quiz._id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            <div className="flex items-center">{getModeIcon(quiz.mode)}</div>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {quiz.description || 'No description'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{quiz.questions.length} questions</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{quiz.participants.length} participants</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t flex justify-between space-x-2 grid grid-cols-2">
                          <Button
                            variant="default"
                            className='col-span-1'
                            disabled={IsUserQuizStarted(quiz)}
                            onClick={() => { handleQuizStart(quiz._id); }}
                          >
                            Start Quiz
                          </Button>
                          <Button
                            variant="secondary"
                            className='col-span-1'
                            disabled={!IsUserQuizStarted(quiz)}
                            onClick={() => { handleViewResult(quiz); }}
                          >
                            View Results
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Quizzes</CardTitle>
                      <CardDescription>
                        You haven't created any quizzes yet
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-6">
                      <Button onClick={() => setQuizState('creating')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Your First Quiz
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="invitedquizzes" className="mt-0">
                {invitations && invitations.length > 0 && (
                  <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {invitations.map((quiz) => (
                      (getUserInvitationStatus(quiz) == 'accepted' || 'completed') &&
                      quiz.creatorId !== user?.id &&
                      <Card key={quiz._id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            <div className="flex items-center">{getModeIcon(quiz.mode)}</div>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {quiz.description || 'No description'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{quiz.questions.length} questions</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{quiz.participants.length} participants</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t flex justify-between space-x-2 grid grid-cols-2">
                          <Button
                            variant="default"
                            className="w-full"
                            disabled={IsUserQuizStarted(quiz)}
                            onClick={() => { handleInvitedQuizStart(quiz._id); }}
                          >
                            Start Quiz
                          </Button>
                          <Button
                            variant="secondary"
                            className="w-full"
                            disabled={!IsUserQuizStarted(quiz)}
                            onClick={() => { handleViewResult(quiz); }}
                          >
                            View Results
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="invitations">
                {invitations.length > 0 ? (
                  <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {invitations.map((invitation) => (
                      getUserInvitationStatus(invitation) == 'pending' && <QuizInvitation
                        key={invitation._id}
                        invitation={invitation}
                        quizId={invitation}
                        quizTitle={invitation.title}
                        inviterName={scorers.filter(item => item._id == invitation.creatorId)[0]?.name}
                        mode={invitation.mode}
                        questionCount={invitation.questions.length}
                        onResponseSubmitted={handleInvitationResponse} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Invitations</CardTitle>
                      <CardDescription>
                        You don't have any pending quiz invitations
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>

              {/* <TabsContent value="history" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz History</CardTitle>
                    <CardDescription>
                      View your previous quiz results and performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        <div className="p-4 text-center text-muted-foreground">
                          No quiz history yet. Complete a quiz to see your results here.
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent> */}
            </Tabs></>)}
      </div>
    </div >
    <Footer />
    <QuizCreator
      userId={user?.id || ''}
      open={quizState === 'creating'}
      onOpenChange={() => setQuizState(null)}
      onQuizCreated={handleQuizCreated}
    />
    {selectedQuiz && <ChallengeFriends
      userId={user?.id || ''}
      open={quizState === 'inviting'}
      onOpenChange={() => setQuizState(null)}
      onChallengeComplete={handleChallengeComplete}
      quiz={selectedQuiz}
    />
    }
  </>
  );
}
