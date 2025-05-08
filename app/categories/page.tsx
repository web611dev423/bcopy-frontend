"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/reducers/categorySlice";
import { fetchPrograms } from "@/store/reducers/programSlice";

export default function Categories() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const categoriesState = useAppSelector((state) => state.categories);
  const programsState = useAppSelector((state) => state.programs);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPrograms());
  }, [dispatch]);

  const categories = categoriesState.items;
  const programs = programsState.items;

  const toggleSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleContentClick = () => {
    // Implementation of handleContentClick
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
      <div className="pt-20">
        <div className="flex flex-col xl:flex-row w-full relative min-h-[calc(100vh-5rem)]">
          <div
            className="flex-1 xl:ml-64 p-4 xl:p-6"
            onClick={handleContentClick}
          >
            <div className="max-w-full mx-auto space-y-8">
              {/* Categories Section */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                  <h2 className="text-2xl font-bold">Programming Categories</h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search categories..."
                      className="pl-10 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                          {category.name[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Programs Section */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                  <h2 className="text-2xl font-bold">Available Programs</h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search programs..."
                      className="pl-10 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {programs.map((program) => (
                    <div
                      onClick={() => window.location.assign('/')}
                      key={program.name}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                          {program.name[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">{program.name}</h3>
                          <p className="text-sm text-gray-600">{program.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button className="mt-2 bg-[#0284DA] hover:bg-[#0284FF]" size="sm">
                    Load More
                    <ChevronDown className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}