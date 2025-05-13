
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Quiz } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { createNewQuiz } from '@/store/reducers/quizSlice';

type QuizCreatorProps = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuizCreated: (quiz: Quiz) => void;
};

export default function QuizCreator({ onQuizCreated, open, onOpenChange }: QuizCreatorProps) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'direct' | 'group' | 'solo'>('solo');
  const [questionCount, setQuestionCount] = useState('10');
  const [category, setCategory] = useState<string>('18');
  const [difficulty, setDifficulty] = useState<string>('anyDifficulty');
  const [questionType, setQuestionType] = useState<string>('anyType');
  const currentQuiz = useAppSelector(state => state.quizzes.currentQuiz);
  const loading = useAppSelector(state => state.quizzes.loading);

  const handleCreateQuiz = async () => {
    if (!title) {
      return;
    }
    const quiz = {
      amount: parseInt(questionCount, 10),
      category: 18,
      difficulty,
      type: questionType,
      creatorId: user?.id,
      participants: [{ userId: user?.id, status: 'accepted' }],
      createdAt: new Date().toISOString(),
      mode,
      title,
      description,
    }
    await dispatch(createNewQuiz(quiz));
  };
  useEffect(() => {
    if (currentQuiz) {
      onQuizCreated(currentQuiz);
    }
  }, [currentQuiz])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 m-0">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Quiz</CardTitle>
            <CardDescription>
              Choose your quiz settings and challenge friends or practice solo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label>Quiz Mode</Label>
              <Tabs
                defaultValue="solo"
                onValueChange={(value) => setMode(value as 'direct' | 'group' | 'solo')}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="solo">Solo Practice</TabsTrigger>
                  <TabsTrigger value="direct">Direct Challenge</TabsTrigger>
                  <TabsTrigger value="group">Group Challenge</TabsTrigger>
                </TabsList>
                <TabsContent value="solo" className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Practice on your own to improve your knowledge
                  </p>
                </TabsContent>
                <TabsContent value="direct" className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Challenge one friend to a 1v1 quiz battle
                  </p>
                </TabsContent>
                <TabsContent value="group" className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Invite multiple friends to compete on the leaderboard
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium">Questions Configuration</h3>

              <div className="space-y-2">
                <Label htmlFor="questionCount">Number of Questions</Label>
                <Select value={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger id="questionCount" className="focus:outline-none focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select number of questions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="25">25 Questions</SelectItem>
                    <SelectItem value="30">30 Questions</SelectItem>
                    <SelectItem value="40">40 Questions</SelectItem>
                    <SelectItem value="50">50 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                  <SelectTrigger id="difficulty" className="focus:outline-none focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anyDifficulty">Any Difficulty</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Question Type</Label>
                <RadioGroup
                  value={questionType}
                  onValueChange={setQuestionType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anyType" id="any" />
                    <Label htmlFor="any">Any Type</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiple" id="multiple" />
                    <Label htmlFor="multiple">Multiple Choice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boolean" id="boolean" />
                    <Label htmlFor="boolean">True/False</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateQuiz}
              disabled={loading || !title}
              className="text-white w-full"
            >
              {loading ? 'Creating Quiz...' : 'Create Quiz'}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent >
    </Dialog >
  );
}
