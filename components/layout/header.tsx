
import { Check, Dot, MessageCircle, Menu, LogOut, ChevronDown, Home, Code, Briefcase, FileText, HelpCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobPostingDialog from "../dialog/jobposting-dialog";
import ApplyJobDialog from "../dialog/applyjob-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const programs = useAppSelector(state => state.programs.items);
  const [showJobPosting, setShowJobPosting] = useState(false);
  const [showApplyJob, setShowApplyJob] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleJobPosting = () => {
    setShowJobPosting(true);
    setMobileMenuOpen(false);
  }

  const handleApplyJob = () => {
    setShowApplyJob(true);
    setMobileMenuOpen(false);
  }

  const navItems = [
    { label: "Codes", icon: <Code className="h-4 w-4 mr-2" />, onClick: () => router.push('/codes') },
    { label: "Jobs", icon: <Briefcase className="h-4 w-4 mr-2" />, onClick: () => router.push('/jobs') },
    { label: "Post Job", icon: <FileText className="h-4 w-4 mr-2" />, onClick: handleJobPosting },
    { label: "Apply Job", icon: <FileText className="h-4 w-4 mr-2" />, onClick: handleApplyJob },
    { label: "Quiz", icon: <HelpCircle className="h-4 w-4 mr-2" />, onClick: () => router.push('/quiz') },
    { label: "Contact Us", icon: <Mail className="h-4 w-4 mr-2" />, onClick: () => router.push('/connect') },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 w-full h-12 bg-[#0284DA]">
        <div className="mx-auto h-full w-full px-4">
          <div className="flex items-center h-full">
            {/* Logo - Fixed width on the left */}
            <div className="w-[120px] flex-shrink-0">
              <div
                className="flex items-center hover:cursor-pointer"
                onClick={() => router.push('/')}
              >
                <h1 className="text-[#f2d898] text-xl sm:text-2xl md:text-3xl font-bold">&lt;Be&gt;</h1>
                <h1 className="text-[#7ad1f4] text-xl sm:text-2xl md:text-3xl font-bold">Copy</h1>
              </div>
            </div>

            {/* Navigation - Always centered */}
            <div className="flex-grow flex justify-center">
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <Button
                    key={index}
                    className="bg-transparent hover:bg-white/20 text-[#7ad1f4] hover:text-white font-bold text-lg"
                    onClick={item.onClick}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stats and User Profile - Fixed width on the right */}
            <div className="w-[120px] flex-shrink-0 flex items-center justify-end">
              {/* Stats - Only visible on medium screens and up */}
              <div className="flex items-center space-x-2 text-white mr-2">
                <p className="text-[#ffd633] flex items-center text-md whitespace-nowrap">
                  <Dot className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">100% Free</span>
                </p>
                <p className="text-[#00ff55] flex items-center text-md whitespace-nowrap">
                  <Check className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{programs?.length || 0} Codes</span>
                </p>
                <p className="hidden md:flex text-[#ffd633] items-center text-md whitespace-nowrap">
                  <Dot className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">350 Live</span>
                </p>
              </div>

              {/* User Avatar or Mobile Menu Toggle */}
              {isAuthenticated &&
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-transparent border-none focus:outline-none focus:ring-0 focus:ring-offset-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#ff1493] text-white text-md">
                        {user?.name
                          .split(' ')
                          .map(word => word[0]?.toUpperCase())
                          .join('')
                        }
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user?.name}
                    </div>
                    <DropdownMenuSeparator />

                    {/* Mobile Navigation in Dropdown - Only visible on smaller screens */}
                    <div className="lg:hidden">
                      {navItems.map((item, index) => (
                        <DropdownMenuItem key={index} onClick={item.onClick} className="cursor-pointer">
                          {item.icon}
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </div>

                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                // ) : (
                //   <div className="flex items-center space-x-2">
                //     <Button
                //       variant="ghost"
                //       className="text-white hover:bg-white/20"
                //       onClick={() => router.push('/auth')}
                //     >
                //       Login
                //     </Button>

                //     {/* Mobile menu button - Only visible on smaller screens */}
                //     <Button
                //       variant="ghost"
                //       size="icon"
                //       className="lg:hidden text-white hover:bg-white/20"
                //       onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                //     >
                //       <Menu className="h-5 w-5" />
                //     </Button>
                //   </div>
                // )
              }
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only visible when toggled */}
      {!isAuthenticated && mobileMenuOpen && (
        <div className="fixed top-12 left-0 right-0 z-40 bg-white shadow-lg lg:hidden">
          <div className="py-2">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start rounded-none text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  item.onClick();
                  setMobileMenuOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <JobPostingDialog
        open={showJobPosting}
        onOpenChange={setShowJobPosting}
      />

      <ApplyJobDialog
        open={showApplyJob}
        onOpenChange={setShowApplyJob}
      />
    </>
  );
}

export default Header;
