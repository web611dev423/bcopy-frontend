'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Clock, AlertCircle } from 'lucide-react';
import { Quiz, Question } from '@/lib/types';
import { decode } from 'html-entities';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/store/hooks';
import { submitQuizResult } from '@/store/reducers/quizSlice';
import { useSocket } from '@/context/SocketContext';

type QuizTakerProps = {
  userId: string;
  quiz: Quiz;
  onComplete: () => void;
  onGoHome: () => void;
};

export default function QuizTaker({ userId, quiz, onComplete, onGoHome }: QuizTakerProps) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<Record<number, string[]>>({});

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = (currentQuestionIndex / totalQuestions) * 100;
  const dispatch = useAppDispatch();
  const { emitEvent } = useSocket();
  // Reset to home view

  // Initialize the quiz and start timer
  const handleStartQuiz = () => {
    const time = new Date().toISOString();
    emitEvent('quiz:start', { quizId: quiz._id, userId, time });

    try {
      toast({
        title: 'Quiz Started',
        description: 'Your timer has started. Good luck!',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to start quiz',
        variant: 'destructive',
      });
    }
    if (time) {
      setStartTime(time);
      setQuizStarted(true);

      // Initialize shuffled answers for all questions
      const initialShuffledAnswers: Record<number, string[]> = {};
      quiz.questions.forEach((question, index) => {
        initialShuffledAnswers[index] = shuffleAnswers(question);
      });
      setShuffledAnswers(initialShuffledAnswers);

      // Start timer
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      setTimerInterval(interval);
    }
  };

  // Shuffle answers for a question
  const shuffleAnswers = (question: Question): string[] => {
    const allAnswers = [...question.incorrect_answers, question.correct_answer];

    // Fisher-Yates shuffle algorithm
    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }

    return allAnswers;
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer
    });
  };

  // Go to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }

    setQuizEnded(true);

    // Calculate score
    let score = 0;
    const answers = Object.entries(selectedAnswers).map(([index, answer]) => {
      const questionIndex = parseInt(index);
      const question = quiz.questions[questionIndex];
      const isCorrect = answer === question.correct_answer;

      if (isCorrect) {
        score++;
      }

      return {
        questionId: question.id,
        selectedAnswer: answer,
        isCorrect
      };
    });

    if (startTime) {
      emitEvent('quiz:complete', {
        userId,
        quizId: quiz._id,
        completedAt: new Date().toISOString()
      });
      await dispatch(submitQuizResult({
        userId,
        quizId: quiz._id,
        score,
        totalQuestions,
        startedAt: startTime,
        completedAt: new Date().toISOString(),
        timeElapsedMs: elapsedTime
      }));
      toast({
        title: 'Quiz Completed',
        description: `You scored ${score}/${totalQuestions} in ${formatTime(elapsedTime)}`,
      });
      onComplete();
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // If quiz hasn't started, show start screen
  if (!quizStarted) {
    return (
      <Card className="w-full max-w-2xl place-self-center">
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <CardDescription>{quiz.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium mb-2">Quiz Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Questions:</span>
                <span>{totalQuestions}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Mode:</span>
                <Badge>
                  {quiz.mode.charAt(0).toUpperCase() + quiz.mode.slice(1)}
                </Badge>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Timer:</span>
                <span>Individual</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Important Note</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Your timer will start as soon as you click the Start button. You can't pause the quiz once started.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='space-x-4'>
          <Button onClick={handleStartQuiz} className="w-full">
            Start Quiz
          </Button>
          <Button onClick={onGoHome} className="w-full">
            Go Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <div>
            <CardTitle className="text-xl mb-1">{quiz.title}</CardTitle>
            {quiz.description && (
              <CardDescription className="text-sm">{quiz.description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 mb-2">
          <Badge variant="outline" className="px-2 py-1">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-1">
            {decode(currentQuestion.question)}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs font-normal">
              {currentQuestion.category}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal capitalize">
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </div>

        <Separator />

        <RadioGroup
          value={selectedAnswers[currentQuestionIndex] || ''}
          onValueChange={handleAnswerSelect}
          className="space-y-3"
        >
          {shuffledAnswers[currentQuestionIndex]?.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={answer}
                id={`answer-${index}`}
                className="border-2"
              />
              <Label htmlFor={`answer-${index}`} className="flex-1 cursor-pointer py-2">
                {decode(answer)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between pt-6 border-t">
        <Button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          className='w-48'
        >
          Previous
        </Button>
        <Button
          onClick={handleNextQuestion}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className='w-48'
        >
          {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish'}
        </Button>
      </CardFooter>
    </Card>
  );
}