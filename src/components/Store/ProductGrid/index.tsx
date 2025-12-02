import React from "react";
import { listProducts } from "@lib/data/products";
import { SortOptions } from "@/components/Store/RefinementList";
import ProductCard from "@/components/Products/ProductCard";
import Pagination from "@/components/Common/Pagination";

interface ProductGridProps {
  sortBy?: SortOptions;
  page: number;
  categoryId?: string;
  countryCode: string;
}

export default async function ProductGrid({
  sortBy,
  page,
  categoryId,
  countryCode,
}: ProductGridProps) {
  const { response } = await listProducts({
    pageParam: page,
    queryParams: {
      category_id: categoryId,
      limit: 8,
    },
    countryCode,
  });

  const products = response.products;
  const count = response.count;
  const totalPages = Math.ceil(count / 8);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ürün bulunamadı
        </h3>
        <p className="text-gray-500">
          Filtrelerinizi veya arama terimlerinizi ayarlamayı deneyin.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Products Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {products.length} / {count} ürün gösteriliyor
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
}
