'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Briefcase, Building2, Calendar, Clock, MapPin,
  DollarSign, Share2, Bookmark, ArrowLeft, Send,
  ExternalLink
} from 'lucide-react';
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJobById } from '@/store/reducers/jobSlice';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const job = useAppSelector((state) => state.jobs.selectedJob);
  const loading = useAppSelector((state) => state.jobs.loading);

  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id as string));
    }
  }, [dispatch, id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Last day';
    return `${diffDays} days`;
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for this job",
        variant: "destructive"
      });
      router.push('/userauth');
      return;
    }

    if (!coverLetter.trim()) {
      toast({
        title: "Cover letter required",
        description: "Please provide a cover letter",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted",
      });

      setApplyDialogOpen(false);
      setCoverLetter('');
      setResume(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveJob = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save this job",
        variant: "destructive"
      });
      router.push('/userauth');
      return;
    }

    // Toggle saved state
    setIsSaved(!isSaved);

    toast({
      title: isSaved ? "Job removed" : "Job saved",
      description: isSaved
        ? "This job has been removed from your saved jobs"
        : "This job has been added to your saved jobs",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title} at ${job?.company}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Job link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex w-full justify-center min-h-screen pt-12 p-4">
          <div className="container max-w-4xl py-8 w-full">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading job details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Header />
        <div className="flex w-full justify-center min-h-screen pt-12 p-4">
          <div className="container max-w-4xl py-8 w-full">
            <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-2xl font-bold">Job not found</h2>
              <p className="mt-2 text-muted-foreground">The job you're looking for doesn't exist or has been removed.</p>
              <Button
                className="mt-6"
                onClick={() => router.push('/jobs')}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex w-full justify-center min-h-screen pt-12 p-4">
        <div className="container max-w-4xl py-8 w-full">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push('/jobs')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>

          {/* Job header */}
          <div className="mb-8">
            {job.isFeatured && (
              <Badge className="mb-2">Featured Opportunity</Badge>
            )}
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-4">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {job.company}
              </div>
              {job.jobLocation && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.jobLocation}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Posted {formatDate(job.createdAt)}
              </div>
              <Badge variant={getDaysRemaining(job.deadline) === 'Expired' ? 'destructive' : 'secondary'} className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getDaysRemaining(job.deadline)} {getDaysRemaining(job.deadline) !== 'Expired' && 'remaining'}
              </Badge>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setApplyDialogOpen(true)}
                disabled={getDaysRemaining(job.deadline) === 'Expired'}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Apply Now
              </Button>
              <Button variant="outline" onClick={handleSaveJob}>
                <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save Job'}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Job details */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>
                    Full information about this position
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="description">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="company">Company</TabsTrigger>
                      <TabsTrigger value="application">Application</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="pt-6">
                      {/* Job Details */}
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                          <div className="text-muted-foreground whitespace-pre-line">
                            {job.description}
                          </div>
                        </div>

                        {job.responsibilities && (
                          <div>
                            <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
                            <div className="text-muted-foreground whitespace-pre-line">
                              {job.responsibilities}
                            </div>
                          </div>
                        )}

                        {job.requirements && (
                          <div>
                            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                            <div className="text-muted-foreground whitespace-pre-line">
                              {job.requirements}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="company" className="pt-6">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                            {job.recruiter?.companyLogo ? (
                              <img
                                src={job.recruiter.companyLogo}
                                alt={job.company}
                                className="max-w-full max-h-full p-2"
                              />
                            ) : (
                              <Building2 className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold">{job.company}</h2>
                            <p className="text-muted-foreground">
                              {job.recruiter?.name || 'Recruiter'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-2">About the Company</h3>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {job.companyDescription ||
                              job.recruiter?.description ||
                              "No company description available."}
                          </p>
                        </div>

                        {job.recruiter?.companyWebsite && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Company Website</h3>
                            <a
                              href={job.recruiter.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center"
                            >
                              {job.recruiter.companyWebsite}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="application" className="pt-6">
                      <div className="space-y-6">
                        {job.howtoapply && (
                          <div>
                            <h2 className="text-xl font-semibold mb-2">How to Apply</h2>
                            <div className="text-muted-foreground whitespace-pre-line">
                              {job.howtoapply}
                            </div>
                          </div>
                        )}

                        <div>
                          <h2 className="text-xl font-semibold mb-2">Application Deadline</h2>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {formatDate(job.deadline)}
                            </span>
                            <Badge variant={getDaysRemaining(job.deadline) === 'Expired' ? 'destructive' : 'secondary'}>
                              {getDaysRemaining(job.deadline)} {getDaysRemaining(job.deadline) !== 'Expired' && 'remaining'}
                            </Badge>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            onClick={() => setApplyDialogOpen(true)}
                            disabled={getDaysRemaining(job.deadline) === 'Expired'}
                            className="w-full"
                          >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Apply for this Position
                          </Button>

                          {getDaysRemaining(job.deadline) === 'Expired' && (
                            <p className="text-destructive text-sm mt-2 text-center">
                              This job posting has expired and is no longer accepting applications.
                            </p>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Job summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Job Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {job.employmentType && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employment Type</span>
                        <span className="font-medium">{job.employmentType}</span>
                      </div>
                    )}

                    {job.experienceLevel && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span className="font-medium">{job.experienceLevel}</span>
                      </div>
                    )}

                    {job.salary && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salary</span>
                        <span className="font-medium">{job.salary}</span>
                      </div>
                    )}

                    {job.jobLocation && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{job.jobLocation}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posted On</span>
                      <span className="font-medium">{formatDate(job.createdAt)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline</span>
                      <span className="font-medium">{formatDate(job.deadline)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={getDaysRemaining(job.deadline) === 'Expired' ? 'destructive' : 'secondary'}>
                        {getDaysRemaining(job.deadline) === 'Expired' ? 'Closed' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar jobs card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Similar job recommendations will appear here based on your browsing history.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => router.push('/jobs')}>
                      Browse All Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Apply dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Complete the form below to submit your application to {job.company}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApply} className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Introduce yourself and explain why you're a good fit for this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="resume">Resume/CV</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setResume(e.target.files[0]);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
