"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";


import Category from "@/components/sections/sidebar/category";
import DailyQuiz from "@/components/sections/sidebar/daily-quiz";
import Articles from "@/components/sections/sidebar/articles";
import { Button } from "../ui/button";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/reducers/categorySlice";
import { fetchPrograms } from "@/store/reducers/programSlice";
import { Program } from "@/types";

interface SidebarProps {
  isSidebarOpen: boolean;
  expandedCategories: string[];
  toggleCategory: (name: string) => void;
  onSelectProgram: (program: Program) => void;
  onShowJobPosting: () => void;
}

const Sidebar = ({
  isSidebarOpen,
  expandedCategories,
  toggleCategory,
  onSelectProgram,
  onShowJobPosting
}: SidebarProps) => {

  const [searchQuery, setSearchQuery] = useState<string>("");
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  const categoriesState = useAppSelector((state) => state.categories);
  const categories = categoriesState.items;
  const programsState = useAppSelector((state) => state.programs);
  const programs = programsState.items;
  useEffect(() => {
    if (categories.length > 0 && expandedCategories.length === 0) {
      toggleCategory(categories[0].name);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // If there's a search query, find and expand categories with matching programs
    if (query.trim()) {
      const matchingCategories = categories.filter(category =>
        programs.some(program =>
          program.name.toLowerCase().includes(query.toLowerCase())
        )
      );

      // Expand all categories that have matching programs
      matchingCategories.forEach(category => {
        if (!expandedCategories.includes(category.name)) {
          toggleCategory(category.name);
        }
      });
    }
  };

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

        {/* Search Bar */}
        <div className="shrink-0 p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search programs..."
              className="pl-10 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Section */}
        <Category
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          onSelectProgram={onSelectProgram}
          searchQuery={searchQuery}
        />

        {/* Bottom Section */}
        <div className="shrink-0 p-4 space-y-4 border-t border-gray-200">
          <div className="flex justify-center">
            <Button
              className="text-[#0284DA] outline-hidden bg-white hover:bg-white hover:text-[#0284FF]"
              onClick={() => window.location.assign('/categories')}
            >
              Browse All
            </Button>
          </div>
          <DailyQuiz />
          <Articles onShowJobPosting={onShowJobPosting} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
