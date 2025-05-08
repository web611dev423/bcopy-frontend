'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trophy,
  Clock,
  Award,
  BarChart3,
  Share2,
  Home,
  RefreshCw,
  Users,
  Backpack,
  CircleArrowLeft
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizResult, Quiz } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
type QuizResultsProps = {
  userId: string;
  quiz: Quiz;
  onPlayAgain: () => void;
  onGoHome: () => void;
};

interface UserResult extends QuizResult {
  username?: string;
  rank?: number;
}

export default function QuizResults({ userId, quiz, onPlayAgain, onGoHome }: QuizResultsProps) {
  const { user } = useAuth();
  const { fetchQuizResults } = useQuiz(user?.id || ''); // Removed `userId` from `useQuiz` hook
  const [results, setResults] = useState<UserResult[]>([]);
  const [userResult, setUserResult] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  // Fetch results on component mount
  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        const quizResults: any[] = await fetchQuizResults(quiz._id); // Added type for `quizResults`
        if (!quizResults) {
          console.error('No quiz results found');
          return;
        } else {
          console.log("quizResults", quizResults);
        }
        // Sort results by time elapsed (fastest first)
        const sortedResults: any[] = quizResults
          .sort((a, b) => {
            // First sort by score (highest first)
            if (b.score !== a.score) return b.score - a.score;
            // Then by time (fastest first)
            return a.timeElapsedMs - b.timeElapsedMs;
          })
          .map((participant, index) => ({
            ...participant.result,
            userId,
            username: `User ${index + 1}`, // In a real app, fetch usernames
            rank: index + 1
          }));

        setResults(sortedResults);
        console.log("sortedResults", sortedResults)
        // Find current user's result
        const currentUserResult = sortedResults.find(r => r.userId === userId) || null;
        setUserResult(currentUserResult);
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [quiz._id, userId]);

  // Calculate stats for charts
  const calculatePieData = (): { name: string; value: number }[] => {
    if (!userResult) return [];

    const correct = userResult.score;
    const incorrect = userResult.totalQuestions - correct;
    return [
      { name: 'Correct', value: correct },
      { name: 'Incorrect', value: incorrect },
    ];
  };

  const calculateRankDistribution = (): { name: string; value: number }[] => {
    const distribution: Record<string, number> = {};

    results.forEach(result => {
      const scoreKey = `${result.score}/${result.totalQuestions}`;
      distribution[scoreKey] = (distribution[scoreKey] || 0) + 1;
    });

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Format time display
  const formatTime = (ms: number): string => {
    const seconds = ms;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Loading Results...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <CardDescription>{quiz.title}</CardDescription>
          </div>
          {quiz.mode === 'group' && (
            <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
              <Users className="h-3 w-3" />
              Group Challenge
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {userResult && (
          <div className="rounded-lg bg-muted p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarFallback>
                    {userResult.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {userResult.rank && userResult.rank <= 3 && (
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Trophy className="h-4 w-4 text-yellow-800" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium">Your Result</h3>
                <p className="text-sm text-muted-foreground">{userResult.username}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <div className="bg-card rounded-md px-3 py-2 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="font-medium">{userResult.score}/{userResult.totalQuestions}</p>
                </div>
              </div>

              <div className="bg-card rounded-md px-3 py-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{formatTime(userResult.timeElapsedMs)}</p>
                </div>
              </div>

              <div className="bg-card rounded-md px-3 py-2 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="font-medium">#{userResult.rank}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs for Leaderboard and Statistics */}
        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="mt-0">
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Final Rankings
                </h3>

                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div
                      key={result.userId} // Changed key to `userId` for uniqueness
                      className={`flex items-center justify-between p-3 rounded-md ${result.userId === userId
                        ? 'bg-primary/10 border border-primary/20'
                        : index % 2 === 0
                          ? 'bg-muted/50'
                          : ''
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted font-medium text-sm">
                          {result.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{result.username?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{result.username}</p>
                          <p className="text-xs text-muted-foreground">
                            Score: {result.score}/{result.totalQuestions}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{formatTime(result.timeElapsedMs)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userResult && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4 text-center">Your Performance</h3>
                  <div className="h-[200px] flex items-center justify-center">
                    <PieChart width={200} height={200}>
                      <Pie
                        data={calculatePieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {calculatePieData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? '#4ade80' : '#f87171'}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </div>
                </div>
              )}

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4 text-center">Score Distribution</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={calculateRankDistribution()}
                      margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        name="Participants"
                        fill="hsl(var(--chart-1))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button variant="default" onClick={onGoHome} className="flex-1">
            <CircleArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          {/* 
          <Button variant="outline" onClick={onPlayAgain} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Play Again
          </Button>

          <Button variant="default" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}