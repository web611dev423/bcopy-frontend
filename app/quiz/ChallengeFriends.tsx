'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus, X, Users } from 'lucide-react';

import { Quiz } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { sendQuizInvitation } from '@/lib/socket';

type ChallengeFriendsProps = {
  userId: string;
  quiz: Quiz;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChallengeComplete: () => void;
};



export default function ChallengeFriends({ userId, quiz, onChallengeComplete, open, onOpenChange }: ChallengeFriendsProps) {

  const dispatch = useAppDispatch();
  const scorers = useAppSelector(state => state.quizzes.scorers);

  // useEffect(() => {
  //   dispatch(fetchQuizScorerList());
  // }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  // Filter users based on search term
  const filteredUsers = scorers?.filter(user =>
    user._id !== userId && user.connected === true &&// Don't show current user
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      // For direct challenge, only allow one user to be selected
      if (quiz.mode === 'direct' && selectedUsers.length > 0) {
        setSelectedUsers([userId]);
      } else {
        setSelectedUsers([...selectedUsers, userId]);
      }
    }
  };

  // Get selected user objects
  const getSelectedUserObjects = () => {
    return scorers.filter(user => selectedUsers.includes(user._id));
  };

  // Send challenge
  const handleSendChallenge = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select at least one user to challenge',
        variant: 'destructive',
      });
      return;
    }

    try {

      sendQuizInvitation(quiz._id, selectedUsers);

      toast({
        title: 'Challenge Sent',
        description: `Invited ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} to the quiz`,
      });

      onChallengeComplete();
    } catch (error) {
      console.error('Error sending challenge:', error);
      toast({
        title: 'Error',
        description: 'Failed to send challenge',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 m-0">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Challenge Friends</CardTitle>
                <CardDescription>
                  {quiz.mode === 'direct'
                    ? 'Select one friend for a direct challenge'
                    : 'Invite friends to participate in this quiz'}
                </CardDescription>
              </div>
              {quiz.mode === 'direct' ? (
                <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                  <UserPlus className="h-3 w-3" />
                  Direct Challenge
                </Badge>
              ) : (
                <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Group Challenge
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/40 rounded-md">
                {getSelectedUserObjects().map(user => (
                  <Badge
                    key={user._id}
                    variant="secondary"
                    className="flex items-center gap-1 pl-1 pr-2 py-1"
                  >
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.name}
                    <button
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => toggleUserSelection(user._id)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-2 space-y-1">
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div
                      key={user._id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-muted/50 ${selectedUsers.includes(user._id) ? 'bg-primary/10 border border-primary/20' : ''
                        }`}
                      onClick={() => toggleUserSelection(user._id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border ${selectedUsers.includes(user._id)
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground'
                        }`}>
                        {selectedUsers.includes(user._id) && (
                          <div className="flex items-center justify-center h-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No users found matching &quot;{searchTerm}&quot;
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleSendChallenge}
              // disabled={loading || selectedUsers.length === 0}
              className="flex items-center gap-1"
            >
              {quiz.mode === 'direct' ? (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Send Challenge
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-1" />
                  Invite Friends ({selectedUsers.length})
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent >
    </Dialog >
  );
}