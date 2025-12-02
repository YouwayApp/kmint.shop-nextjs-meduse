"use client";

import { useState } from "react";
import { HttpTypes } from "@medusajs/types";

type ProductAboutProps = {
  product: HttpTypes.StoreProduct;
};

export default function ProductAbout({ product }: ProductAboutProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!product.description) {
    return null;
  }

  // Split description into words for truncation
  const words = product.description.split(" ");
  const maxWords = 50; // Show first 50 words
  const shouldTruncate = words.length > maxWords;
  const truncatedText = shouldTruncate
    ? words.slice(0, maxWords).join(" ") + "..."
    : product.description;

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-base sm:text-lg font-semibold text-dark mb-3">
        Ürün Hakkında
      </h3>
      <div className="space-y-2 text-xs sm:text-sm text-dark-4">
        <p>{isExpanded ? product.description : truncatedText}</p>
      </div>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-blue hover:text-blue-dark text-xs sm:text-sm font-medium transition-colors duration-200"
        >
          {isExpanded ? "Daha Az" : "Devamını Oku"}
        </button>
      )}
    </div>
  );
}
