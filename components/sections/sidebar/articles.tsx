import { Briefcase } from "lucide-react";
import { ARTICLES } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchJobs } from "@/store/reducers/jobSlice";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface ArticlesProps {
  onShowJobPosting: () => void;
}

const Articles = ({ onShowJobPosting }: ArticlesProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const jobs = useAppSelector((state) => state.jobs.items);
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-2 flex items-center">
        <Briefcase className="h-6 w-6 mr-2 text-[#0284DA]" /> Latest Articles
      </h3>
      <div className="space-y-2">
        {jobs.map((job) => (
          job.isVisible && (
            <div key={job._id} className="text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
              {job.title}
            </div>
          )
        ))}
      </div>
      {user?.role === "recruiter" && (
        <Button onClick={onShowJobPosting} className="w-full mt-4 bg-[#0284DA] hover:bg-[#0284FF] text-white"> Job Posting</Button>
      )}
    </div>
  );
};

export default Articles; 