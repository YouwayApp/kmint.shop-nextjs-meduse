"use client";

import { updateLineItem } from "@lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { Table, Text } from "@medusajs/ui";
import CartItemSelect from "@modules/cart/components/cart-item-select";
import ErrorMessage from "@modules/checkout/components/error-message";
import DeleteButton from "@modules/common/components/delete-button";
import LineItemOptions from "@modules/common/components/line-item-options";
import LineItemPrice from "@modules/common/components/line-item-price";
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Spinner from "@modules/common/icons/spinner";
import Thumbnail from "@modules/products/components/thumbnail";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ItemProps = {
  item: HttpTypes.StoreCartLineItem;
  type?: "full" | "preview";
  currencyCode: string;
};

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const changeQuantity = async (quantity: number) => {
    setError(null);
    setUpdating(true);

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .then(() => {
        // Refresh the page to update cart totals
        router.refresh();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10;
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory;

  // Preview type için Table.Row kullan
  if (type === "preview") {
    return (
      <>
        <Table.Row className="w-full" data-testid="product-row">
          <Table.Cell className="!pl-0 p-4 w-24">
            <div className="flex w-16">
              <LocalizedClientLink href={`/products/${item.product_handle}`}>
                <Thumbnail
                  thumbnail={item.thumbnail}
                  images={item.variant?.product?.images}
                  size="small"
                />
              </LocalizedClientLink>
            </div>
          </Table.Cell>

          <Table.Cell className="text-left">
            <Text
              className="txt-medium-plus text-ui-fg-base"
              data-testid="product-title"
            >
              {item.product_title}
            </Text>

            {error && (
              <Text
                className="txt-small text-red-600 mt-1"
                data-testid="product-error-message"
              >
                {error}
              </Text>
            )}
          </Table.Cell>

          <Table.Cell className="!pr-0">
            <span className="!pr-0 flex flex-col items-end h-full justify-center gap-2">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQuantity(Math.max(1, item.quantity - 1))}
                  disabled={updating || item.quantity <= 1}
                  aria-label="ürünü azalt butonu"
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-blue hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                </button>

                <div className="w-8 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-dark font-medium text-sm">
                  {updating ? (
                    <svg
                      className="animate-spin w-3.5 h-3.5"
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
                    <span data-testid="product-quantity">{item.quantity}</span>
                  )}
                </div>

                <button
                  onClick={() => changeQuantity(item.quantity + 1)}
                  disabled={updating}
                  aria-label="ürün ekle butonu"
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-blue hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                </button>
              </div>

              {/* Price Info */}
              <div className="flex flex-col items-end gap-1">
                <span className="flex gap-x-1 text-sm text-ui-fg-muted">
                  <LineItemUnitPrice
                    item={item}
                    style="tight"
                    currencyCode={currencyCode}
                  />
                  <span>x {item.quantity}</span>
                </span>
                <LineItemPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </div>
            </span>
          </Table.Cell>
        </Table.Row>
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4" data-testid="product-row">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="flex items-start gap-3 mb-3">
          {/* Product Image */}
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              className="w-full h-full"
            >
              <Thumbnail
                thumbnail={item.thumbnail}
                images={item.variant?.product?.images}
                size="square"
              />
            </LocalizedClientLink>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-dark font-medium text-sm mb-1 line-clamp-2">
              <LocalizedClientLink
                href={`/products/${item.product_handle}`}
                className="hover:text-blue transition-colors"
              >
                {item.product_title}
              </LocalizedClientLink>
            </h3>
          </div>
        </div>

        {/* Mobile Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="text-dark font-bold text-lg">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeQuantity(Math.max(1, item.quantity - 1))}
              disabled={updating || item.quantity <= 1}
              aria-label="ürünü kaldır butonu"
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
              aria-label="ürün ekle butonu"
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-blue hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Delete Button - Mobile */}
        <div className="mt-3 flex justify-end">
          <DeleteButton
            id={item.id}
            data-testid="product-delete-button"
            className="text-blue text-sm hover:text-red transition-colors"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between">
        {/* Left Section - Product Details */}
        <div className="flex items-center gap-4 flex-1">
          {/* Product Image */}
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              className="w-full h-full"
            >
              <Thumbnail
                thumbnail={item.thumbnail}
                images={item.variant?.product?.images}
                size="square"
              />
            </LocalizedClientLink>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h3 className="text-dark font-medium text-sm mb-1">
              <LocalizedClientLink
                href={`/products/${item.product_handle}`}
                className="hover:text-blue transition-colors"
              >
                {item.product_title}
              </LocalizedClientLink>
            </h3>

            {/* Delete Button */}
            <div className="mt-2">
              <DeleteButton
                id={item.id}
                data-testid="product-delete-button"
                className="text-blue text-sm hover:text-red transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Price and Quantity */}
        <div className="flex items-center gap-4">
          {/* Price */}
          <div className="text-right">
            <div className="text-dark font-bold text-lg">
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeQuantity(Math.max(1, item.quantity - 1))}
              disabled={updating || item.quantity <= 1}
              aria-label="ürünü kaldır butonu"
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
              aria-label="ürün ekle butonu"
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-blue hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <ErrorMessage error={error} data-testid="product-error-message" />
    </div>
  );
};

export default Item;
