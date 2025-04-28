import { ChevronDown, FolderOpen, Folder, FileCode } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/reducers/categorySlice";
import { fetchPrograms } from "@/store/reducers/programSlice";
import { useEffect } from "react";
import { Program } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components

interface CategoryProps {
  expandedCategories: string[];
  toggleCategory: (name: string) => void;
  onSelectProgram: (program: Program) => void;
  searchQuery: string;
}

const Category = ({ expandedCategories, toggleCategory, onSelectProgram, searchQuery }: CategoryProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPrograms());
  }, [dispatch]);

  const categoriesState = useAppSelector((state) => state.categories);
  const programsState = useAppSelector((state) => state.programs);

  const categories = categoriesState.items;
  const programs = programsState.items;

  // Recursive function to render categories and subcategories
  const renderCategoryTree = (categoryId: string | null) => {
    return categories
      .filter((category) => category.parent === categoryId) // Filter by parentId
      .map((category) => (
        <div key={category._id} className="space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleCategory(category._id)}
                  className="w-full flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {expandedCategories.includes(category._id) ? (
                    <FolderOpen className="h-4 w-4 text-blue-500 mr-2" />
                  ) : (
                    <Folder className="h-4 w-4 text-blue-500 mr-2" />
                  )}
                  <span className="text-sm font-medium">{category.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 ml-auto transition-transform ${expandedCategories.includes(category._id) ? "transform rotate-180" : ""
                      }`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{category.description || "No description available"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {expandedCategories.includes(category._id) && (
            <div className="ml-4 space-y-1">
              {/* Render child categories */}
              {renderCategoryTree(category._id)}
              {/* Render programs under this category */}
              {programs
                .filter(
                  (program) =>
                    program.isActive &&
                    program.category === category._id &&
                    program.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((program) => (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          key={program._id}
                          className="w-full flex items-center p-2 hover:bg-gray-100 rounded-md text-sm group"
                          onClick={() => onSelectProgram(program)}
                        >
                          <FileCode className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{program.name}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{program.description || "No description available"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </div>
          )}
        </div>
      ));
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-[300px]">
      <div className="p-4 space-y-2">{renderCategoryTree(null)}</div>
    </div>
  );
};

export default Category;