"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth"; // You'll need to create this hook
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { newjob } from "@/store/reducers/jobSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobPostingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobPostingDialog = ({ open, onOpenChange }: JobPostingFormProps) => {
  const { isAuthenticated, user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [company, setCompany] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");
  const [howtoapply, setHowtoapply] = useState("");
  useEffect(() => {
    if (open && !isAuthenticated) {
      onOpenChange(false); // Close the dialog
      router.push('/auth'); // Redirect to auth page
    }
  }, [open, isAuthenticated, router, onOpenChange]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    setLoading(true);
    setError("");
    dispatch(newjob({
      recruiter: user?.id,
      title,
      company,
      description,
      responsibilities,
      requirements,
      jobLocation,
      salary,
      deadline,
      howtoapply,
    })).then(() => {
      onOpenChange(false);
      setLoading(false);
    }).catch((error) => {
      setError(error.message);
      setLoading(false);
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-size p-0 m-0">
        <Card className="w-full h-full overflow-auto">
          <CardHeader>
            <CardTitle>
              Post a Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-4 py-4 align-items-end">
              <div className="col-span-4 gap-2 ">
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className=" col-span-2 gap-2">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)} required className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className="col-span-6">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className=" gap-2 col-span-3">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea id="responsibilities" name="responsibilities" value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className=" gap-2 col-span-3">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea id="requirements" name="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className=" gap-2 col-span-2">
                <Label htmlFor="jobLocation">Job Location</Label>
                <Select
                  value={jobLocation}
                  onValueChange={(value: "UK" | "CA" | "US" | "AU" | "Europe") => setJobLocation(value)}
                >
                  <SelectTrigger className="focus:outline-none focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0">
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="CA">CA</SelectItem>
                    <SelectItem value="US">US</SelectItem>
                    <SelectItem value="AU">AU</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className=" gap-2 col-span-2">
                <Label htmlFor="salary">Salary</Label>
                <Input id="salary" name="salary" value={salary} onChange={(e) => setSalary(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className=" gap-2 col-span-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input id="deadline" name="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className=" gap-2 col-span-6">
                <Label htmlFor="howtoapply">How to Apply</Label>
                <Textarea id="howtoapply" name="howtoapply" value={howtoapply} onChange={(e) => setHowtoapply(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <Button type="submit" className="bg-[#0284DA] hover:bg-[#0284FF] text-white col-span-3" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" className='col-span-3'>
                  Cancel
                </Button>
              </DialogClose>

            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
export default JobPostingDialog;