import { Check, Dot, Twitter, Menu, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobPostingDialog from "../dialog/jobposting-dialog";
import ApplyJobDialog from "../dialog/applyjob-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";


const Header = () => {

  const { user, logout, isAuthenticated } = useAuth();

  const router = useRouter();
  const programs = useAppSelector(state => state.programs.items);
  const [showJobPosting, setShowJobPosting] = useState(false);
  const [showApplyJob, setShowApplyJob] = useState(false);
  const handleJobPosting = () => {
    setShowJobPosting(true);
  }
  const handleApplyJob = () => {
    setShowApplyJob(true);
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-12 bg-[#0284DA] grid grid-cols-12">
      <JobPostingDialog
        open={showJobPosting}
        onOpenChange={setShowJobPosting}
      />

      <ApplyJobDialog
        open={showApplyJob}
        onOpenChange={setShowApplyJob}
      />
      <div className="flex items-center sm:items-left text-2xl font-bold sm:text-3xl justify-start ps-2 sm:ps-4 col-span-4 sm:col-span-4">
        <div
          className="flex items-center hover:cursor-pointer"
          onClick={() => router.push('/')}
        >
          <h1 className="text-[#f2d898]">&lt;Be&gt;</h1>
          <h1 className="text-[#7ad1f4]">Copy</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center space-x-2 col-span-6 sm:col-span-4">
        <p className="text-[#ffd633] flex items-center sm:text-sm md:text-md lg:text-lg">
          <Dot className="w-3 sm:w-8 h-3 sm:h-8" />
          100% Free
        </p>
        <p className="text-[#00ff55] flex items-center  sm:text-sm md:text-md lg:text-lg">
          <Check className="w-3 sm:w-6 h-3 sm:h-6 pe-0 sm:pe-2" />
          {programs && programs.length}Codes
        </p>
        <p className="hidden lg:flex text-[#ffd633]  flex items-center  sm:text-sm md:text-md lg:text-lg">
          <Dot className="w-3 sm:w-8 w-3 sm:h-8" />
          350 Live
        </p>

      </div>
      <div className="flex items-center justify-end text-white col-span-2 sm:col-span-4">
        <div className="hidden lg:flex gap-2">
          <Button
            className="bg-transparent hover:bg-white/20 text-[#7ad1f4] hover:text-white font-bold text-lg"
            onClick={() => { console.log("categories"); router.push('/categories'); }}>
            Codes
          </Button>
          <Button
            className="bg-transparent hover:bg-white/20 text-[#7ad1f4] hover:text-white font-bold text-lg"
            onClick={handleJobPosting}
          >
            Post Job
          </Button>
          <Button
            className="bg-transparent hover:bg-white/20 text-[#7ad1f4] hover:text-white font-bold text-lg"
            onClick={handleApplyJob}
          >
            Apply Job
          </Button>
          <Button
            onClick={() => { console.log("quiz"); router.push('/quiz'); }}
            className="bg-transparent hover:bg-white/20 text-[#7ad1f4] hover:text-white font-bold text-lg"
          >
            Quiz
          </Button>
        </div>
        <Twitter className="hidden sm:block w-10 h-10 pe-4" />
        <div>
          {
            isAuthenticated &&
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-transparent mr-4 border-none focus:outline-none focus:ring-0 focus:ring-offset-0">
                <Avatar>
                  <AvatarFallback className="bg-[#ff1493] text-white">
                    {user?.name
                      .split(' ')
                      .map(word => word[0]?.toUpperCase())
                      .join('')
                    }
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="ring-0 focus-visible:ring-offset-4 focus-visible:ring-0 p-0 m-0">
                <DropdownMenuItem className="md:hidden relative">
                  <Button
                    className="w-full h-full p-0 bg-transparent text-black hover:bg-transparent"
                    onClick={() => router.push('/categories')}>
                    Codes
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden relative">
                  <Button
                    className="w-full h-full p-0 bg-transparent text-black hover:bg-transparent"
                    onClick={handleJobPosting}
                  >
                    Post Job
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden relative">
                  <Button
                    className="w-full h-full p-0 bg-transparent text-black hover:bg-transparent"
                    onClick={handleApplyJob}
                  >
                    Apply Job
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden relative">
                  <Button
                    onClick={() => router.push('/quiz')}
                    className="w-full h-full p-0 bg-transparent text-black hover:bg-transparent"
                  >
                    Quiz
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="md:hidden relative" />
                <DropdownMenuItem className="md:hidden relative">
                  <Button className="w-full h-full p-0 bg-transparent text-black hover:bg-transparent">
                    <Twitter className="h-4 w-4 mr-4" />Contact Us
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="md:hidden relative" />
                <DropdownMenuItem>
                  <Button onClick={logout} className="w-full h-full p-0 bg-transparent text-black hover:bg-transparent">
                    <LogOut className="h-4 w-4 mr-4" />
                    Log out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        </div>

        {/* <Button
          size="icon"
          className="xl:hidden text-white ml-2 outline-hidden bg-transparent hover:bg-transparent hover:text-white items-center"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button> */}
      </div>
    </div>
  )
}

export default Header;