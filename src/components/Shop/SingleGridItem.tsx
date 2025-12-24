"use client";
import React, { useState } from "react";
import { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import Image from "next/image";
import { getProductPrice } from "@/lib/util/get-product-price";
import PreviewPrice from "../Meduse/price";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { useCartActions } from "@/providers/CartProvider";
import { useToaster } from "react-hot-toast";

interface SingleGridItemProps {
  item: HttpTypes.StoreProduct;
  countryCode: string;
}

const SingleGridItem = ({ item, countryCode }: SingleGridItemProps) => {
  const thumbnail = item.thumbnail;
  const price = item.variants?.[0]?.calculated_price;
  const { openCartModal } = useCartModalContext();
  const { addItemToCart } = useCartActions();
  const [isAdding, setIsAdding] = useState(false);
  const toast = useToaster();

  const handleAddToCart = async () => {
    if (!item.variants?.[0]?.id) {
      console.error("No variant available for this product");
      return;
    }

    try {
      setIsAdding(true);
      await addItemToCart(item.variants[0].id, 1, countryCode);
      openCartModal(); // Open cart modal after successful add
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const { cheapestPrice } = getProductPrice({
    product: item,
  });

  return (
    <div className="group bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300">
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <LocalizedClientLink
          href={`/products/${item.handle}`}
          className="block w-full h-full"
        >
          {thumbnail ? (
            <div className="relative w-full h-full">
              <Image
                src={thumbnail}
                alt={item.title || "Product"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">
                Resim Yok
              </span>
            </div>
          )}
        </LocalizedClientLink>
      </div>

      {/* Product Info */}
      <div className="p-0 space-y-3">
        {/* Product Title */}
        <h3 className="font-semibold text-dark text-center text-sm sm:text-base leading-tight line-clamp-2 min-h-[2rem] group-hover:text-blue transition-colors duration-200">
          <LocalizedClientLink
            href={`/products/${item.handle}`}
            className="block"
          >
            {item.title}
          </LocalizedClientLink>
        </h3>

        {/* Price */}
        <div className="flex items-center justify-center">
          {cheapestPrice && (
            <div className="text-lg font-bold text-dark">
              <PreviewPrice price={cheapestPrice} />
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !item.variants?.[0]?.id}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue hover:bg-blue-dark text-white font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isAdding ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Ekleniyor...</span>
            </>
          ) : item.variants?.[0]?.id ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Sepete Ekle</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Yakında Stokta</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SingleGridItem;
