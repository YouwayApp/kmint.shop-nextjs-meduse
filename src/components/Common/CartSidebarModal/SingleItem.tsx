import React, { useState } from "react";
import { HttpTypes } from "@medusajs/types";
import { useCartActions } from "@/providers/CartProvider";
import LineItemOptions from "@modules/common/components/line-item-options";
import LineItemPrice from "@modules/common/components/line-item-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Thumbnail from "@modules/products/components/thumbnail";
import ErrorMessage from "@modules/checkout/components/error-message";

interface SingleItemProps {
  item: HttpTypes.StoreCartLineItem;
  currencyCode?: string;
  onCartUpdate?: () => void;
}

const SingleItem = ({
  item,
  currencyCode = "usd",
  onCartUpdate,
}: SingleItemProps) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateItemQuantity, removeItemFromCart } = useCartActions();

  const changeQuantity = async (quantity: number) => {
    setError(null);
    setUpdating(true);

    try {
      await updateItemQuantity(item.id, quantity);
      // Refresh cart after successful update
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update quantity"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setUpdating(true);

    try {
      await removeItemFromCart(item.id);
      // Refresh cart after successful delete
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4" data-testid="product-row">
      {/* Product Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Product Image and Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              className="w-full h-full"
            >
              <Thumbnail
                thumbnail={item.thumbnail}
                images={item.variant?.product?.images}
                size="square"
                className="-z-0"
              />
            </LocalizedClientLink>
          </div>
          <div>
            <h3 className="text-dark font-medium text-sm">
              <LocalizedClientLink
                href={`/products/${item.product_handle}`}
                className="hover:text-blue transition-colors"
              >
                {item.product_title}
              </LocalizedClientLink>
            </h3>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <div className="text-dark">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeQuantity(Math.max(1, item.quantity - 1))}
            disabled={updating || item.quantity <= 1}
            aria-label="button for remove product"
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-blue hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </button>

          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-dark font-medium">
            {updating ? (
              <svg
                className="animate-spin w-4 h-4"
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
            ) : (
              item.quantity
            )}
          </div>

          <button
            onClick={() => changeQuantity(item.quantity + 1)}
            disabled={updating}
            aria-label="button for add product"
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-blue hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
          </button>
        </div>

        {/* Delete Button */}
        <div
          className="flex items-center gap-1 text-blue hover:text-red transition-colors cursor-pointer"
          onClick={handleDelete}
        >
          <span className="text-sm">Sil</span>
          {updating ? (
            <svg
              className="animate-spin w-4 h-4"
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
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Error Message */}
      <ErrorMessage error={error} data-testid="product-error-message" />
    </div>
  );
};

export default SingleItem;
