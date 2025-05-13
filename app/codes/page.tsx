"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Search, Trophy, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/reducers/categorySlice";
import { fetchPrograms } from "@/store/reducers/programSlice";
import { fetchContributors } from "@/store/reducers/contributorSlice";

export default function Categories() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const categoriesState = useAppSelector((state) => state.categories);
  const programsState = useAppSelector((state) => state.programs);
  const contributorsState = useAppSelector((state) => state.contributors);
  const categories = categoriesState.items;
  const programs = programsState.items;
  const contributors = contributorsState.items;
  // Search states
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [programSearchTerm, setProgramSearchTerm] = useState('');

  // Expanded categories state
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Selected category for programs display
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPrograms());
    dispatch(fetchContributors());
  }, [dispatch]);

  // Effect to handle search and expand categories with matching items
  useEffect(() => {
    if (categorySearchTerm.trim() === '') return;

    // Find categories that match the search term directly
    const matchingCategories = categories.filter(category =>
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    // Find categories that have subcategories matching the search term
    const categoriesWithMatchingSubcategories = categories.filter(category => {
      // Get all subcategory IDs recursively
      const getAllSubcategoryIds = (parentId: string): string[] => {
        const subcategories = categories.filter(cat => cat.parent === parentId);
        const matchingSubcategories = subcategories.filter(subcat =>
          subcat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
          subcat.description?.toLowerCase().includes(categorySearchTerm.toLowerCase())
        );

        if (matchingSubcategories.length > 0) return [parentId];

        // Recursively check subcategories
        const nestedMatches = subcategories.flatMap(cat => getAllSubcategoryIds(cat._id));

        return nestedMatches.length > 0 ? [parentId, ...nestedMatches] : [];
      };

      return getAllSubcategoryIds(category._id).length > 0;
    });

    // Combine all categories that should be expanded
    const categoriesToExpand = [
      ...matchingCategories.map(c => c._id),
      ...categoriesWithMatchingSubcategories.map(c => c._id)
    ];

    // Also expand parent categories of matching subcategories
    const getParentChain = (categoryId: string): string[] => {
      const category = categories.find(c => c._id === categoryId);
      if (!category || !category.parent) return [categoryId];
      return [...getParentChain(category.parent), categoryId];
    };

    const allCategoriesToExpand = Array.from(
      new Set(
        categoriesToExpand.flatMap(id => getParentChain(id))
      )
    );

    // Update expanded categories
    setExpandedCategories(prev => {
      const newExpanded = [...prev];
      allCategoriesToExpand.forEach(id => {
        if (!newExpanded.includes(id)) {
          newExpanded.push(id);
        }
      });
      return newExpanded;
    });
  }, [categorySearchTerm, categories]);



  // Get top contributors (sorted by contribution count)
  const topContributors = [...contributors]
    .slice(0, 10);

  // Filter main categories (those with no parent)
  const mainCategories = categories.filter(category => !category.parent);

  // Get subcategories for a given parent
  const getSubcategories = (parentId: string) => {
    return categories.filter(category => category.parent === parentId);
  };

  // Get programs for a category (including subcategories)
  const getCategoryPrograms = (categoryId: string) => {
    // Get direct programs for this category
    const directPrograms = programs.filter(program => program.category === categoryId);

    // Get all subcategory IDs recursively
    const getAllSubcategoryIds = (parentId: string): string[] => {
      const subcategories = categories.filter(cat => cat.parent === parentId);
      const subcategoryIds = subcategories.map(cat => cat._id);

      // Recursively get subcategories of subcategories
      const nestedIds = subcategories.flatMap(cat => getAllSubcategoryIds(cat._id));

      return [...subcategoryIds, ...nestedIds];
    };

    const allSubcategoryIds = getAllSubcategoryIds(categoryId);

    // Get programs for all subcategories
    const subcategoryPrograms = programs.filter(program =>
      allSubcategoryIds.includes(program.category)
    );

    // Combine and return all programs
    return [...directPrograms, ...subcategoryPrograms];
  };

  // Check if a category has subcategories
  const hasSubcategories = (categoryId: string) => {
    return categories.some(category => category.parent === categoryId);
  };

  // Handle category selection for programs display
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);

    // Expand the category if it's not already expanded
    if (!expandedCategories.includes(categoryId)) {
      toggleCategory(categoryId);
    }
  };

  // Recursive function to render category and its subcategories
  const renderCategoryTree = (category: any, level = 0) => {
    const subcategories = getSubcategories(category._id);
    const isExpanded = expandedCategories.includes(category._id);
    const isSelected = selectedCategory === category._id;

    // Check if this category or any of its subcategories match the search
    const matchesSearch =
      categorySearchTerm.trim() === '' ||
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(categorySearchTerm.toLowerCase());

    // Check if any subcategory matches the search (recursive)
    const hasMatchingSubcategory = (parentId: string): boolean => {
      const subcats = getSubcategories(parentId);

      // Check direct subcategories
      const directSubcategoryMatch = subcats.some(subcat =>
        subcat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
        subcat.description?.toLowerCase().includes(categorySearchTerm.toLowerCase())
      );

      if (directSubcategoryMatch) return true;

      // Check nested subcategories recursively
      return subcats.some(subcat => hasMatchingSubcategory(subcat._id));
    };

    // If there's a search term and neither this category nor its subcategories match, hide it
    if (categorySearchTerm.trim() !== '' && !matchesSearch && !hasMatchingSubcategory(category._id)) {
      return null;
    }

    // Highlight matching text in category name and description
    const highlightMatch = (text: string) => {
      if (categorySearchTerm.trim() === '') return text;

      const regex = new RegExp(`(${categorySearchTerm})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    return (
      <div key={category._id} className="space-y-2">
        <div
          className={`bg-white p-3 rounded-lg ${level === 0 ? 'shadow-sm hover:shadow-md' : 'border border-gray-100 hover:border-gray-200'} 
            ${isSelected ? 'ring-2 ring-blue-500' : ''} 
            ${categorySearchTerm && matchesSearch ? 'bg-yellow-50' : ''} 
            transition-all cursor-pointer`}
          onClick={() => toggleCategory(category._id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {level > 0 && <div className="w-4" />}
              <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                {category.name[0]}
              </div>
              <div>
                <h3
                  className={`${level === 0 ? 'font-semibold' : 'font-medium text-sm'}`}
                  dangerouslySetInnerHTML={{ __html: highlightMatch(category.name) }}
                />
                <p
                  className={`${level === 0 ? 'text-sm' : 'text-xs'} text-gray-600`}
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(category.description || "No description")
                  }}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategorySelect(category._id);
                }}
              >
                {isSelected ? 'Unselect' : 'Select'}
              </Button>
              {(hasSubcategories(category._id)) && (
                isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )
              )}
            </div>
          </div>
        </div>

        {isExpanded && subcategories.length > 0 && (
          <div className={`ml-${level > 0 ? '4' : '8'} space-y-2`}>
            {/* Render subcategories recursively */}
            {subcategories.map(subcategory => renderCategoryTree(subcategory, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filter main categories based on search term
  const filteredMainCategories = mainCategories.filter(category => {
    // If no search term, show all main categories
    if (categorySearchTerm.trim() === '') return true;

    // Check if this category matches the search term
    const directMatch =
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(categorySearchTerm.toLowerCase());

    // Check if any subcategory matches the search term (recursive)
    const hasMatchingSubcategory = (parentId: string): boolean => {
      const subcategories = getSubcategories(parentId);

      // Check direct subcategories
      const directSubcategoryMatch = subcategories.some(subcat =>
        subcat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
        subcat.description?.toLowerCase().includes(categorySearchTerm.toLowerCase())
      );

      if (directSubcategoryMatch) return true;

      // Check nested subcategories recursively
      return subcategories.some(subcat => hasMatchingSubcategory(subcat._id));
    };

    return directMatch || hasMatchingSubcategory(category._id);
  });

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(programSearchTerm.toLowerCase()) ||
    program.description?.toLowerCase().includes(programSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      {/* Add overlay for mobile/tablet */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="pt-20">
        <div className="flex flex-col xl:flex-row w-full relative min-h-[calc(100vh-5rem)]">
          {/* Top Contributors Sidebar */}
          <div className="hidden xl:block w-64 fixed left-0 h-[calc(100vh-5rem)] overflow-y-auto p-4 bg-translate translate-y-[-25px]">
            <Card className={`h-full hover:cursor-pointer  bg-transparent`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  10 Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div>
                  {topContributors.map((contributor, index) => (
                    <div key={contributor._id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{contributor.name}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {contributor.contributions?.length || 0} contributions
                        </p>
                      </div>
                      {contributor.verified && (
                        <Badge variant="outline" className="ml-auto">Verified</Badge>
                      )}
                    </div>
                  ))}

                  {contributorsState.loading && (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  )}

                  {!contributorsState.loading && topContributors.length === 0 && (
                    <div className="py-4 text-center text-sm text-gray-500">
                      No contributors found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 xl:ml-64 p-4 xl:p-6">
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
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMainCategories.map((category) => renderCategoryTree(category))}
                </div>
              </div>

              {/* Available Programs Section */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                  <h2 className="text-2xl font-bold">
                    {selectedCategory
                      ? `Programs in ${categories.find(c => c._id === selectedCategory)?.name || 'Selected Category'}`
                      : 'All Programs'}
                  </h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search programs..."
                      className="pl-10 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                      value={programSearchTerm}
                      onChange={(e) => setProgramSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {selectedCategory === null && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 text-center">
                    <p className="text-blue-700">Please select a category to view its programs</p>
                  </div>
                )}

                {selectedCategory !== null && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {getCategoryPrograms(selectedCategory)
                      .filter(program =>
                        program.name.toLowerCase().includes(programSearchTerm.toLowerCase()) ||
                        program.description?.toLowerCase().includes(programSearchTerm.toLowerCase())
                      )
                      .map((program) => (
                        <div
                          onClick={() => window.location.assign('/')}
                          key={program._id}
                          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                              {program.name[0]}
                            </div>
                            <div>
                              <h3 className="font-semibold">{program.name}</h3>
                              <p className="text-sm text-gray-600">{program.description || "No description"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {selectedCategory !== null && getCategoryPrograms(selectedCategory).length === 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500">No programs found in this category</p>
                  </div>
                )}

                {selectedCategory !== null &&
                  getCategoryPrograms(selectedCategory).filter(program =>
                    program.name.toLowerCase().includes(programSearchTerm.toLowerCase()) ||
                    program.description?.toLowerCase().includes(programSearchTerm.toLowerCase())
                  ).length > 16 && (
                    <div className="mt-4 text-center">
                      <Button className="mt-2 bg-[#0284DA] hover:bg-[#0284FF]" size="sm">
                        Load More
                        <ChevronDown className="h-5 w-5 text-white" />
                      </Button>
                    </div>
                  )}
              </div>

              {/* Mobile Top Contributors Section */}
              <div className="xl:hidden mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Top Contributors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {topContributors.slice(0, 6).map((contributor, index) => (
                    <div
                      key={contributor._id}
                      className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{contributor.name}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {contributor.contributions?.length || 0} contributions
                        </p>
                      </div>
                      {contributor.verified && (
                        <Badge variant="outline" className="ml-auto">Verified</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  );
}
