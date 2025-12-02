import React from "react";
import Image from "next/image";
import { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import { convertToLocale } from "@lib/util/money";
import { Heart, ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: HttpTypes.StoreProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.thumbnail;
  const price = product.variants?.[0]?.calculated_price;

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 hover:border-blue-300">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <div className="aspect-square relative">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={product.title || "Product"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Resim Yok</span>
              </div>
            )}
          </div>
        </LocalizedClientLink>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-2">
            <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
              <Heart size={16} className="text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
              <Eye size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Sale Badge */}
        {product.discountable && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              İndirim
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.categories && product.categories.length > 0 && (
          <p className="text-xs text-gray-500 mb-1">
            {product.categories[0].name}
          </p>
        )}

        {/* Product Title */}
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <h3 className="font-medium text-dark hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {product.title}
          </h3>
        </LocalizedClientLink>

        {/* Product Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {price ? (
              <span className="text-lg font-bold text-dark">
                {convertToLocale({
                  amount: price.calculated_amount / 100, // Convert from cents
                  currency_code: price.currency_code || "USD",
                })}
              </span>
            ) : (
              <span className="text-lg font-bold text-gray-400">
                Fiyat mevcut değil
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <ShoppingCart size={16} />
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
