"use client";

import { addToCart } from "@lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { isEqual } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { convertToLocale } from "@/lib/util/money";
import { useCartActions } from "@/providers/CartProvider";

type ProductActionsCustomProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  disabled?: boolean;
};

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value;
    return acc;
  }, {});
};

export default function ProductActionsCustom({
  product,
  region,
  disabled,
}: ProductActionsCustomProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    {}
  );
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const countryCode = useParams().countryCode as string;

  const { refreshCart } = useCartActions();

  // Preselect the first variant options on component mount
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const variantOptions = optionsAsKeymap(product.variants[0].options);
      setOptions(variantOptions ?? {});
    }
  }, [product.variants]);

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return;
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
  }, [product.variants, options]);

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
  }, [product.variants, options]);

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // Use selected variant or first variant if none selected
    const variantToUse =
      selectedVariant ||
      (product.variants && product.variants.length > 0
        ? product.variants[0]
        : null);

    if (!variantToUse) return false;

    // If we don't manage inventory, we can always add to cart
    if (!variantToUse.manage_inventory) {
      return true;
    }

    // If we allow back orders on the variant, we can add to cart
    if (variantToUse.allow_backorder) {
      return true;
    }

    // If there is inventory available, we can add to cart
    if (
      variantToUse.manage_inventory &&
      (variantToUse.inventory_quantity || 0) > 0
    ) {
      return true;
    }

    // Otherwise, we can't add to cart
    return false;
  }, [selectedVariant, product.variants]);

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    // Use selected variant or first variant if none selected
    const variantToUse =
      selectedVariant ||
      (product.variants && product.variants.length > 0
        ? product.variants[0]
        : null);

    if (!variantToUse?.id) return null;

    setIsAdding(true);

    await addToCart({
      variantId: variantToUse.id,
      quantity: quantity,
      countryCode,
    });

    await refreshCart();

    setIsAdding(false);
  };

  // Get price for selected variant
  const getPrice = () => {
    // If no variant is selected but variants exist, use first variant
    const variantToUse =
      selectedVariant ||
      (product.variants && product.variants.length > 0
        ? product.variants[0]
        : null);

    if (!variantToUse) return null;

    const price = variantToUse.calculated_price?.calculated_amount;
    const currencyCode = region.currency_code;

    if (!price) return null;

    return convertToLocale({
      amount: price,
      currency_code: currencyCode,
    });
  };

  return (
    <div className="space-y-6">
      {/* Product Options */}
      {(product.variants?.length ?? 0) > 1 && (
        <div className="space-y-4">
          {(product.options || []).map((option) => (
            <div key={option.id}>
              <label className="block text-sm font-medium text-dark mb-2">
                {option.title}
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {option.values?.map((value) => (
                  <button
                    key={value.id}
                    onClick={() => setOptionValue(option.id, value.value)}
                    disabled={!!disabled || isAdding}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md border text-xs sm:text-sm font-medium transition-all duration-200 ${
                      options[option.id] === value.value
                        ? "border-blue bg-blue text-white"
                        : "border-gray-3 text-dark hover:border-gray-4 hover:bg-gray-1"
                    }`}
                  >
                    {value.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Section */}
      <div className="bg-gray-1 rounded-lg p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Single Payment Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-dark-4">Tek ödeme fiyatı</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-dark">
                {getPrice() || "Seçenekleri seçin"}
              </p>
            </div>
          </div>

          {/* Bank Transfer Price */}
          <div className="border-t border-gray-3 pt-3 sm:pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-dark-4">Havale fiyatı</p>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-green-600">
                  {getPrice() || "Seçenekleri seçin"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-green-600 font-semibold">
                  Kazancınız: 0.00 TL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Miktar
        </label>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-3 rounded-md flex items-center justify-center hover:bg-gray-1 transition-colors"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-12 sm:w-16 h-8 sm:h-10 border border-gray-3 rounded-md text-center font-medium text-sm sm:text-base"
            min="1"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-3 rounded-md flex items-center justify-center hover:bg-gray-1 transition-colors"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!inStock || !!disabled || isAdding || !isValidVariant}
        className="w-full bg-blue text-white py-3 sm:py-4 px-4 sm:px-6 rounded-md font-semibold text-base sm:text-lg hover:bg-blue-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Ekleniyor...
          </div>
        ) : !inStock || !isValidVariant ? (
          "Stokta yok"
        ) : (
          "Sepete Ekle"
        )}
      </button>
    </div>
  );
}
