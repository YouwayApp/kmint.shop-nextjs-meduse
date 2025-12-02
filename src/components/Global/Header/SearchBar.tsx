"use client";
import React, { useState } from "react";
import CustomSelect from "./CustomSelect";
import { useCategories } from "@/providers/SiteProvider";
import { useRouter } from "next/navigation";

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    label: "Kategori Seçin",
    value: "0",
    handle: "",
  });
  const { categories, categoriesLoading, getRootCategories } = useCategories();

  // Create options from categories
  const rootCategories = getRootCategories();
  const options =
    rootCategories.length > 0
      ? [
          ...rootCategories.map((category) => ({
            label: category.name,
            value: category.id,
            handle: category.handle,
          })),
        ]
      : [{ label: "Kategori bulunamadı", value: "0", handle: "" }];

  // Show loading state while categories are loading
  if (categoriesLoading) {
    return (
      <div className="max-w-[475px] w-full">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-32 h-[42px] bg-gray-200 rounded-l-[5px] animate-pulse"></div>
          <div className="relative max-w-[333px] sm:min-w-[333px] w-full">
            <div className="w-full h-[42px] bg-gray-200 rounded-r-[5px] animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleCategoryChange = (category: {
    label: string;
    value: string;
    handle: string;
  }) => {
    setSelectedCategory(category);
    console.log("Selected category:", category); // Optional: for debugging
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const textSearch = formData.get("search") as string;

    // Don't search if query is empty
    if (!textSearch || textSearch.trim() === "") {
      return;
    }

    // If a specific category is selected and it's not the fallback
    if (selectedCategory.value !== "0" && selectedCategory.handle) {
      // Search within the selected category using its handle
      router.push(
        `/categories/${selectedCategory.handle}?q=${encodeURIComponent(
          textSearch
        )}`
      );
    } else {
      // General search across all categories
      router.push(`/categories?q=${encodeURIComponent(textSearch)}`);
    }
  };

  return (
    <div className="max-w-[475px] w-full">
      <form onSubmit={handleSearch}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CustomSelect options={options} onChange={handleCategoryChange} />
          </div>

          <div className="relative max-w-[333px] sm:min-w-[333px] w-full">
            {/* divider */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-gray-4"></span>
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              type="search"
              name="search"
              id="search"
              placeholder="Ürün Ara"
              autoComplete="off"
              className="custom-search w-full rounded-r-[5px] bg-gray-1 !border-l-0 border border-gray-3 py-[9px] pl-4 pr-10 outline-none ease-in duration-200"
            />

            <button
              id="search-btn"
              aria-label="Ara"
              className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 ease-in duration-200 hover:text-blue"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
