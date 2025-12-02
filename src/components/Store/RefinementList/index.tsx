"use client";

import React from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/UI";
import { ChevronDown, Filter } from "lucide-react";

export type SortOptions = "created_at" | "updated_at" | "price" | "title";

interface RefinementListProps {
  sortBy?: SortOptions;
}

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "En Yeni" },
  { value: "updated_at", label: "Son Güncellenen" },
  { value: "price", label: "Fiyat: Düşükten Yükseğe" },
  { value: "title", label: "İsim: A'dan Z'ye" },
];

export default function RefinementList({ sortBy }: RefinementListProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createSortURL = (sortValue: SortOptions) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", sortValue);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-dark">Filtreler</h3>
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sırala</h4>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <a
              key={option.value}
              href={createSortURL(option.value)}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                sortBy === option.value
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Fiyat Aralığı
        </h4>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="sm" fullWidth>
            Fiyat Filtresini Uygula
          </Button>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="ghost" size="sm" fullWidth>
        Tüm Filtreleri Temizle
      </Button>
    </div>
  );
}
