"use client";

import { useEffect, useState } from "react";

import CodeCard from "@/components/custom/code-card";
import ChatGPTCard from "@/components/custom/chatgpt-card";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import CodeDialog from "@/components/dialog/code-dialog";
import FeedbackDialog from "@/components/dialog/feedback-dialog";
import JobPostingDialog from "@/components/dialog/jobposting-dialog";

import { ARTICLES, LANGUAGES, HELLO_DEVELOPER } from "@/constants";
import Sidebar from "@/components/layout/sidebar";

import Recruiters from "@/components/sections/recruiters";
import Contributors from "@/components/sections/contributors";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/reducers/categorySlice";
import { Fascinate } from "next/font/google";
import { Program } from "@/types";
import { copyProgram } from "@/store/reducers/programSlice";


export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"bug" | "suggestion">("bug");
  const [showJobPosting, setShowJobPosting] = useState(false);

  const handleFeedback = (type: "bug" | "suggestion") => {
    setShowFeedback(true);
    setFeedbackType(type);
  }

  const handleJobPosting = () => {
    setShowJobPosting(true);
  }

  const categoriesState = useAppSelector((state) => state.categories);
  const categories = categoriesState.items;
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.length > 0 ? [categories[0].name] : []
  );
  const [showDialog, setShowDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program>(
    {
      _id: "",
      name: "",
      code: {
        java: "",
        python: "",
        html: ""
      },
    }
  );


  useEffect(() => {
    if (showDialog && selectedLanguage.length > 0) {
      setIsOpen(true);
    }
  }, [showDialog]);

  const handleCopyCode = async (code: string) => {
    if (selectedProgram.name === "") {
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
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
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
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
          />
          <div
            className="flex-1 xl:ml-64 p-4 xl:p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <CodeCard
                code={selectedProgram.name === ""
                  ? HELLO_DEVELOPER.java
                  : removeBackticks(selectedProgram.code?.java)}
                language="java"
                title={selectedProgram.name === ""
                  ? "Hello Developer"
                  : selectedProgram.name}
                clickFunc={setSelectedLanguage}
                showDialog={setShowDialog}
                copyCode={() => handleCopyCode(selectedProgram.code?.java)}
                isDashboard={selectedProgram.name === ""}
                onShowFeedback={handleFeedback}
              />
              <CodeCard
                code={selectedProgram.name === ""
                  ? HELLO_DEVELOPER.python
                  : removeBackticks(selectedProgram.code?.python)}
                language="python"
                title={selectedProgram.name === ""
                  ? "Hello Developer"
                  : selectedProgram.name}
                clickFunc={setSelectedLanguage}
                showDialog={setShowDialog}
                copyCode={() => handleCopyCode(selectedProgram.code?.python)}
                isDashboard={selectedProgram.name === ""}
                onShowFeedback={handleFeedback}
              />
              <CodeCard
                code={selectedProgram.name === ""
                  ? HELLO_DEVELOPER.html
                  : removeBackticks(selectedProgram.code?.html)}
                language="html"
                title={selectedProgram.name === ""
                  ? "Hello Developer"
                  : selectedProgram.name}
                clickFunc={setSelectedLanguage}
                showDialog={setShowDialog}
                copyCode={() => handleCopyCode(selectedProgram.code?.html)}
                isDashboard={selectedProgram.name === ""}
                onShowFeedback={handleFeedback}
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
        copyCode={() => handleCopyCode(selectedProgram.code?.[selectedLanguage as keyof typeof selectedProgram.code])}
      />

      <FeedbackDialog
        type={feedbackType}
        programId={selectedProgram._id}
        open={showFeedback}
        onOpenChange={setShowFeedback}
      />

      <JobPostingDialog
        open={showJobPosting}
        onOpenChange={setShowJobPosting}
      />
    </div>
  );
}