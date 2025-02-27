import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaTimes, FaTag } from "react-icons/fa";

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onFilterByTag: (tag: string | null) => void;
  availableTags: string[];
}

export default function SearchAndFilters({
  onSearch,
  onFilterByTag,
  availableTags,
}: SearchAndFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, onSearch]);

  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      onFilterByTag(null);
    } else {
      setSelectedTag(tag);
      onFilterByTag(tag);
    }
  };

  const handleClearFilters = () => {
    setSelectedTag(null);
    setSearchQuery("");
    onFilterByTag(null);
    onSearch("");
  };

  const hasActiveFilters = searchQuery || selectedTag;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-grow w-full">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-10 py-2 border border-gray-200 rounded-lg focus:border-[#00C805] focus:outline-none transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 self-end">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
              showFilters
                ? "bg-[#00C805] text-white"
                : "bg-white hover:bg-gray-100 border border-gray-200 text-gray-700"
            }`}
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <FaFilter className="w-3 h-3 mr-2" />
            Filters
          </button>
          {hasActiveFilters && (
            <button
              className="px-4 py-2 rounded-full text-sm font-medium bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors flex items-center"
              onClick={handleClearFilters}
              aria-label="Clear filters"
            >
              <FaTimes className="w-3 h-3 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {showFilters && availableTags.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
          <div className="flex items-center mb-3">
            <FaTag className="text-[#00C805] mr-2" />
            <p className="text-sm font-medium text-gray-700">Filter by tag:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? "bg-[#E8F9E9] text-[#00C805] border border-[#00C805]"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
