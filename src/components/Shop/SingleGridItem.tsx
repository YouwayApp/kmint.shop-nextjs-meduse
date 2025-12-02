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
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-white shadow-1 min-h-[270px] mb-4">
        <LocalizedClientLink href={`/products/${item.handle}`}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={item.title || "Product"}
              width={250}
              height={250}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Resim Yok</span>
            </div>
          )}
        </LocalizedClientLink>
      </div>

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1 text-center min-h-[1.5rem] flex items-center justify-center">
        <LocalizedClientLink
          href={`/products/${item.handle}`}
          className="block truncate"
        >
          {item.title}
        </LocalizedClientLink>
      </h3>

      <span className="flex items-center gap-2 font-medium text-md text-center justify-center min-h-[2.5rem]">
        {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
      </span>

      <button
        onClick={handleAddToCart}
        disabled={isAdding || !item.variants?.[0]?.id}
        className="w-full border mt-4 border-blue-dark flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-blue-dark rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-dark"
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
            Ekleniyor...
          </>
        ) : item.variants?.[0]?.id ? (
          "Sepete Ekle"
        ) : (
          "Yakında Stokta"
        )}
      </button>
    </div>
  );
};

export default SingleGridItem;
