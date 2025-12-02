"use client";

import React from "react";
import { useCart } from "@/providers/CartProvider";
import { convertToLocale } from "@/lib/util/money";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const MobileCartBar: React.FC = () => {
  const { cart } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-lg px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-4">
        {/* Cart Info */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-600">
            {itemCount} {itemCount === 1 ? "ürün" : "ürün"}
          </span>
          <span className="text-lg font-bold text-dark">
            {convertToLocale({
              amount: cart.total || 0,
              currency_code: cart.currency_code || "try",
            })}
          </span>
          <span className="text-xs text-gray-500">(KDV Dahil)</span>
        </div>

        {/* Checkout Button */}
        <LocalizedClientLink
          href="/checkout"
          className="flex-shrink-0 bg-blue text-white font-medium px-6 py-3 rounded-md hover:bg-blue-dark transition-colors duration-200"
        >
          Ödeme Yap
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default MobileCartBar;

