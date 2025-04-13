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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { newjob } from "@/store/reducers/jobSlice";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    setLoading(true);
    setError("");
    dispatch(newjob({
      useremail: user?.email,
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
      <DialogContent className="p-0 m-0 max-w-fit">
        <Card className="bg-white border-[#c8c8c8] w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] max-w-[1200px]">
          <CardHeader>
            <CardTitle>
              Post a Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4 flex align-items-end">
              <div className="grid cols-span-1 gap-2 ">
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className="grid cols-span-1 gap-2">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)} required className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className="grid gap-2 cols-span-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className="grid gap-2 cols-span-1">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea id="responsibilities" name="responsibilities" value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className="grid gap-2 cols-span-1">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea id="requirements" name="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className="grid gap-2 cols-span-1">
                <Label htmlFor="jobLocation">Job Location</Label>
                <Input id="jobLocation" name="jobLocation" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className="grid gap-2 cols-span-1">
                <Label htmlFor="salary">Salary</Label>
                <Input id="salary" name="salary" value={salary} onChange={(e) => setSalary(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className="grid gap-2 cols-span-1">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input id="deadline" name="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />
              </div>
              <div className="grid gap-2 cols-span-1">
                <Label htmlFor="howtoapply">How to Apply</Label>
                <Textarea id="howtoapply" name="howtoapply" value={howtoapply} onChange={(e) => setHowtoapply(e.target.value)} className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" />

              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <Button type="submit" className="cols-span-2 place-self-end bg-[#0284DA] hover:bg-[#0284FF] text-white" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
export default JobPostingDialog;