"use client";

import React from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/UI";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  nextPage?: number;
  prevPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  nextPage,
  prevPage,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      {prevPage && (
        <a href={createPageURL(prevPage)}>
          <Button variant="outline" size="sm">
            <ChevronLeft size={16} />
            Önceki
          </Button>
        </a>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <a
            key={page}
            href={createPageURL(page)}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {page}
          </a>
        ))}
      </div>

      {/* Next Button */}
      {nextPage && (
        <a href={createPageURL(nextPage)}>
          <Button variant="outline" size="sm">
            Sonraki
            <ChevronRight size={16} />
          </Button>
        </a>
      )}
    </div>
  );
}
