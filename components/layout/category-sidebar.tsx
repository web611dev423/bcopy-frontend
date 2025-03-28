"use client";

import DailyQuiz from "@/components/sections/sidebar/daily-quiz";
import Articles from "@/components/sections/sidebar/articles";
import { Button } from "../ui/button";

interface CategorySidebarProps {
  isSidebarOpen: boolean;
}

const CategorySidebar = ({ isSidebarOpen }: CategorySidebarProps) => {
  return (
    <div className={`
      fixed xl:fixed inset-y-0 left-0 z-40 overflow-y-auto
      w-64 bg-white border-r border-gray-200
      transform transition-transform duration-300 ease-in-out 
      top-12 xl:top-12
      h-[calc(100vh-3rem)]
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
    `}>
      <div className="h-full flex flex-col overflow-auto">
        {/* Bottom Section */}
        <div className="shrink-0 p-4 space-y-4 border-t border-gray-200">
          <div className="flex justify-center">
            <Button
              className="text-[#0284DA] outline-hidden bg-white hover:bg-white hover:text-[#0284FF]"
              onClick={() => window.location.assign('/')}
            >
              Go Back
            </Button>
          </div>
          <DailyQuiz />
          <Articles />
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar; 