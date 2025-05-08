'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useQuiz } from '@/hooks/useQuiz';
import { Quiz } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
type QuizCreatorProps = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuizCreated: (quiz: Quiz) => void;
};

export default function QuizCreator({ onQuizCreated, open, onOpenChange }: QuizCreatorProps) {
  const { user } = useAuth()
  const { createNewQuiz, loading } = useQuiz(user?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'direct' | 'group' | 'solo'>('solo');
  const [questionCount, setQuestionCount] = useState(10);
  const [category, setCategory] = useState<string>('18');
  const [difficulty, setDifficulty] = useState<string>('anyDifficulty');
  const [questionType, setQuestionType] = useState<string>('anyType');


  const handleCreateQuiz = async () => {
    if (!title) {
      return;
    }
    const newQuiz = await createNewQuiz(
      title,
      description,
      mode,
      {
        amount: questionCount,
        category: 18,
        difficulty: difficulty !== 'anyDifficulty' ? difficulty as 'easy' | 'medium' | 'hard' : undefined,
        type: questionType !== 'anyType' ? questionType as 'multiple' | 'boolean' : undefined,
      }
    );

    if (newQuiz) {
      onQuizCreated(newQuiz.data);
    }
  };

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
                <Label>Number of Questions: {questionCount}</Label>
                <Slider
                  min={5}
                  max={20}
                  step={1}
                  value={[questionCount]}
                  onValueChange={(value) => setQuestionCount(value[0])}
                />

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