"use client";

import { useEffect, useState } from "react";

import CodeCard from "@/components/custom/code-card";
import ChatGPTCard from "@/components/custom/chatgpt-card";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import CodeDialog from "@/components/dialog/code-dialog";
import FeedbackDialog from "@/components/dialog/feedback-dialog";

import { ARTICLES, LANGUAGES, HELLO_DEVELOPER } from "@/constants";
import Sidebar from "@/components/layout/sidebar";

import Recruiters from "@/components/sections/recruiters";
import Contributors from "@/components/sections/contributors";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/reducers/categorySlice";
import { fetchDashboardString } from "@/store/reducers/dashStringSlice";
import { Fascinate } from "next/font/google";
import { Program } from "@/types";
import { copyProgram, viewProgram } from "@/store/reducers/programSlice";
import { savedContributions } from "@/store/reducers/contributionSlice";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchDashboardString());
  }, [dispatch]);
  const { user, isAuthenticated } = useAuth();
  // useEffect(() => {
  //   if (isAuthenticated && user?.id) {
  //     dispatch(savedContributions(user.id));
  //   }
  // }, [isAuthenticated, user?.id]);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"bug" | "suggestion">("bug");
  const [showJobPosting, setShowJobPosting] = useState(false);
  const [showApplyJob, setShowApplyJob] = useState(false);

  const handleFeedback = (type: "bug" | "suggestion") => {
    setShowFeedback(true);
    setFeedbackType(type);
  }

  const handleJobPosting = () => {
    setShowJobPosting(true);
  }

  const handleApplyJob = () => {
    setShowApplyJob(true);
  }
  const categoriesState = useAppSelector((state) => state.categories);
  const dashboardString = useAppSelector((state) => state.dashboardstring.dashboardString);
  const categories = categoriesState.items;
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.length > 0 ? [categories[0].name] : []
  );
  const [showDialog, setShowDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleViewCode = async () => {
    setShowDialog(true);
    await dispatch(viewProgram(selectedProgram._id));
  }
  const [selectedProgram, setSelectedProgram] = useState<Program>(
    {
      _id: "",
      name: "",
      code: {
        java: "",
        python: "",
        html: ""
      },
      views: 0,
      copies: 0,
      shares: 0,
    }
  );


  useEffect(() => {
    if (showDialog && selectedLanguage.length > 0) {
      setIsOpen(true);
    }
  }, [showDialog]);

  const handleCopyCode = async () => {
    if (selectedProgram.name === "") {
      return;
    }
    dispatch(copyProgram(selectedProgram._id));
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    // Close sidebar on mobile/tablet after selection
    if (window.innerWidth < 1280) { // xl breakpoint
      setIsSidebarOpen(false);
    }
  };

  const removeBackticks = (code: string) => {
    return code.replace(/`/g, '');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      {/* Add overlay for mobile/tablet */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div className="pt-12">
        <div className="flex flex-col xl:flex-row w-full relative min-h-[calc(100vh-5rem)]">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            onSelectProgram={handleProgramSelect}
            onShowJobPosting={handleJobPosting}
            onShowApplyJob={handleApplyJob}
          />
          <Button
            size="icon"
            className="fixed z-50 bottom-4 right-4 xl:hidden bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all duration-300"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div
            className="flex-1 xl:ml-64 p-4 xl:p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <CodeCard
                code={selectedProgram.name === ""
                  ? dashboardString.dashString
                  : removeBackticks(selectedProgram.code?.java)}
                language="java"
                title={selectedProgram.name === ""
                  ? "Hello Developer"
                  : selectedProgram.name}
                clickFunc={setSelectedLanguage}
                showDialog={handleViewCode}
                copyCode={handleCopyCode}
                isDashboard={selectedProgram.name === ""}
                onShowFeedback={handleFeedback}
                copiedNumber={selectedProgram.copies}
                viewedNumber={selectedProgram.views}
                sharedNumber={selectedProgram.shares}
              />
              <CodeCard
                code={selectedProgram.name === ""
                  ? dashboardString.dashString
                  : removeBackticks(selectedProgram.code?.python)}
                language="python"
                title={selectedProgram.name === ""
                  ? "Hello Developer"
                  : selectedProgram.name}
                clickFunc={setSelectedLanguage}
                showDialog={handleViewCode}
                copyCode={handleCopyCode}
                isDashboard={selectedProgram.name === ""}
                onShowFeedback={handleFeedback}
                copiedNumber={selectedProgram.copies}
                viewedNumber={selectedProgram.views}
                sharedNumber={selectedProgram.shares}
              />
              <CodeCard
                code={selectedProgram.name === ""
                  ? dashboardString.dashString
                  : removeBackticks(selectedProgram.code?.html)}
                language="html"
                title={selectedProgram.name === ""
                  ? "Hello Developer"
                  : selectedProgram.name}
                clickFunc={setSelectedLanguage}
                showDialog={handleViewCode}
                copyCode={handleCopyCode}
                isDashboard={selectedProgram.name === ""}
                onShowFeedback={handleFeedback}
                copiedNumber={selectedProgram.copies}
                viewedNumber={selectedProgram.views}
                sharedNumber={selectedProgram.shares}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 sm:gap-4">
              <div className="col-span-1 mb-4 sm:mb-0">
                <ChatGPTCard language={selectedLanguage} clickFunc={setSelectedLanguage} showDialog={setShowDialog} />
              </div>
              <div className="col-span-2 space-y-2 grid grid-rows-2 justify-stretch">
                <div className="w-full overflow-x-auto">
                  <Contributors />
                </div>
                <div className="w-full overflow-x-auto">
                  <Recruiters />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <CodeDialog
        open={isOpen} onOpenChange={(open: boolean) => {
          setIsOpen(open);
          if (!open) {
            setShowDialog(false);
            setSelectedLanguage("");
          }
        }}
        onShowFeedback={handleFeedback}
        language={selectedLanguage}
        code={selectedLanguage === "java" ? selectedProgram.name === "" ? HELLO_DEVELOPER.java : removeBackticks(selectedProgram.code?.java) :
          selectedLanguage === "python" ? selectedProgram.name === "" ? HELLO_DEVELOPER.python : removeBackticks(selectedProgram.code?.python) :
            selectedProgram.name === "" ? HELLO_DEVELOPER.html : removeBackticks(selectedProgram.code?.html)}
        title={selectedProgram.name === "" ? "Hello Developer" : selectedProgram.name}
        copyCode={handleCopyCode}
      />

      <FeedbackDialog
        type={feedbackType}
        programId={selectedProgram._id}
        open={showFeedback}
        onOpenChange={setShowFeedback}
        selectedProgram={selectedProgram}
      />
    </div>
  );
}