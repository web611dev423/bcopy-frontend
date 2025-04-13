import { ChevronDown, FolderOpen, Folder, FileCode } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/reducers/categorySlice";
import { fetchPrograms } from "@/store/reducers/programSlice";
import { useEffect } from "react";
import { Program } from "@/types";

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

  return (
    <div className="flex-1 overflow-y-auto min-h-[400px]">
      <div className="p-4 space-y-2">
        {categories.map((category) => (
          <div key={category._id} className="space-y-1">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              {expandedCategories.includes(category.name) ? (
                <FolderOpen className="h-4 w-4 text-blue-500 mr-2" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500 mr-2" />
              )}
              <span className="text-sm font-medium">{category.name}</span>
              <ChevronDown
                className={`h-4 w-4 ml-auto transition-transform 
                ${expandedCategories.includes(category.name) ? 'transform rotate-180' : ''}`}
              />
            </button>
            {expandedCategories.includes(category.name) && (
              <div className="ml-4 space-y-1">
                {programs.filter((program) => program.isActive && program.category === category._id && program.name.toLowerCase().includes(searchQuery.toLowerCase())).map((program) => (
                  <button
                    key={program._id}
                    className="w-full flex items-center p-2 hover:bg-gray-100 rounded-md text-sm group"
                    onClick={() => onSelectProgram(program)}
                  >
                    <FileCode className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{program.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category; 