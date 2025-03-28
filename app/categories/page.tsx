"use client";

import { useState } from "react";
import { ChevronDown, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import CategorySidebar from "@/components/layout/category-sidebar";

export default function Categories() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const categories = [
    { id: "B", name: "Basic Programs", description: "Fundamental programming concepts" },
    { id: "A", name: "Algorithms", description: "Common algorithm implementations" },
    { id: "D", name: "Data Structures", description: "Common data structure implementations" },
  ];

  const programs = [
    { id: "H", name: "Hello World", description: "Basic hello world program" },
    { id: "V", name: "Variables", description: "Variable declaration examples" },
    { id: "B", name: "Bubble Sort", description: "Bubble sort implementation" },
    { id: "L", name: "Linked List", description: "Linked list implementation" },
    { id: "D1", name: "Dummy Program 1", description: "This is a dummy program..." },
    { id: "D2", name: "Dummy Program 2", description: "This is a dummy program..." },
    { id: "D3", name: "Dummy Program 3", description: "This is a dummy program..." },
    { id: "D4", name: "Dummy Program 4", description: "This is a dummy program..." },
  ];

  const handleProgramClick = (category: string, program: string) => {
    // Implementation of handleProgramClick 
  };

  const handleContentClick = () => {
    // Implementation of handleContentClick
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
      <div className="pt-20">
        <div className="flex flex-col xl:flex-row w-full relative min-h-[calc(100vh-5rem)]">
          <CategorySidebar
            isSidebarOpen={isSidebarOpen}
          />
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
                      key={category.id}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                          {category.id}
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
                      key={program.id}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                          {program.id[0]}
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