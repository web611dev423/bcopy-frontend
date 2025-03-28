"use client";

import { useEffect, useState } from "react";

import CodeCard from "@/components/custom/code-card";
import ChatGPTCard from "@/components/custom/chatgpt-card";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import CodeDialog from "@/components/dialog/code-dialog";

import { CATEGORIES, CONTRIBUTORS, RECRUITERS, ARTICLES, LANGUAGES, SAMPLE_CODES, HELLO_DEVELOPER } from "@/constants";
import Sidebar from "@/components/layout/sidebar";

import Recruiters from "@/components/sections/recruiters";
import Contributors from "@/components/sections/contributors";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    CATEGORIES.length > 0 ? [CATEGORIES[0].name] : []
  );
  const [showDialog, setShowDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");


  useEffect(() => {
    if (showDialog && selectedLanguage.length > 0) {
      setIsOpen(true);
    }
  }, [showDialog]);

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

  const handleProgramSelect = (category: string, program: string) => {
    setSelectedCategory(category);
    setSelectedProgram(program);
    // Close sidebar on mobile/tablet after selection
    if (window.innerWidth < 1280) { // xl breakpoint
      setIsSidebarOpen(false);
    }
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
          />
          <div
            className="flex-1 xl:ml-64 p-4 xl:p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <CodeCard
                code={selectedProgram.length > 0 ? SAMPLE_CODES[selectedCategory][selectedProgram].java : HELLO_DEVELOPER}
                language="c"
                title={selectedProgram.length > 0 ? selectedProgram : "Hello Developer"}
                clickFunc={setSelectedLanguage}
                showDialog={setShowDialog}
                isDashboard={selectedProgram.length > 0 ? false : true}
              />
              <CodeCard
                code={selectedProgram.length > 0 ? SAMPLE_CODES[selectedCategory][selectedProgram].python : HELLO_DEVELOPER}
                language="python"
                title={selectedProgram.length > 0 ? selectedProgram : "Hello Developer"}
                clickFunc={setSelectedLanguage}
                showDialog={setShowDialog}
                isDashboard={selectedProgram.length > 0 ? false : true}
              />
              <CodeCard
                code={selectedProgram.length > 0 ? SAMPLE_CODES[selectedCategory][selectedProgram].html : HELLO_DEVELOPER}
                language="html"
                title={selectedProgram.length > 0 ? selectedProgram : "Hello Developer"}
                clickFunc={setSelectedLanguage}
                showDialog={setShowDialog}
                isDashboard={selectedProgram.length > 0 ? false : true}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 sm:gap-4">
              <div className="col-span-1 mb-4 sm:mb-0">
                <ChatGPTCard language={selectedLanguage} clickFunc={setSelectedLanguage} showDialog={setShowDialog} />
              </div>
              <div className="col-span-2 space-y-2 grid grid-rows-2 justify-stretch">
                <div className="w-full overflow-x-auto">
                  <Contributors contributors={CONTRIBUTORS} />
                </div>
                <div className="w-full overflow-x-auto">
                  <Recruiters recruiters={RECRUITERS} />
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
        language={selectedLanguage}
        code={selectedLanguage === "c" ? selectedProgram.length > 0 ? SAMPLE_CODES[selectedCategory][selectedProgram].java : HELLO_DEVELOPER :
          selectedLanguage === "python" ? selectedProgram.length > 0 ? SAMPLE_CODES[selectedCategory][selectedProgram].python : HELLO_DEVELOPER :
            selectedProgram.length > 0 ? SAMPLE_CODES[selectedCategory][selectedProgram].html : HELLO_DEVELOPER}
        title={selectedProgram.length > 0 ? selectedProgram : "Hello Developer"}
      />
    </div>
  );
}