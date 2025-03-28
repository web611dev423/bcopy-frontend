import { ChevronDown, FolderOpen, Folder, FileCode } from "lucide-react";
import { CATEGORIES } from "@/constants";

interface CategoryProps {
  expandedCategories: string[];
  toggleCategory: (name: string) => void;
  onSelectProgram: (category: string, program: string) => void;
  searchQuery: string;
}

const Category = ({ expandedCategories, toggleCategory, onSelectProgram, searchQuery }: CategoryProps) => {
  return (
    <div className="flex-1 overflow-y-auto min-h-[400px]">
      <div className="p-4 space-y-2">
        {CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-1">
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
                {category.items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                  <button
                    key={item}
                    className="w-full flex items-center p-2 hover:bg-gray-100 rounded-md text-sm group"
                    onClick={() => onSelectProgram(category.name, item)}
                  >
                    <FileCode className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{item}</span>
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