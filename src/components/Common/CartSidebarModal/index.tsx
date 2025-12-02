"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import SingleItem from "./SingleItem";
import EmptyCart from "./EmptyCart";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import PriceRefreshTimer from "@modules/cart/components/price-refresh-timer";
import { retrieveCart } from "@/lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const router = useRouter();
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "tr";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await retrieveCart();
      setCart(cartData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCartModalOpen) {
      fetchCart();
    }
  }, [isCartModalOpen]);

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeCartModal();
      }
    }

    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen, closeCartModal]);

  return (
    <div
      className={`fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full h-screen bg-dark/70 ease-linear duration-300 ${
        isCartModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-end h-screen">
        <div className="w-full max-w-[500px] shadow-1 bg-white px-4 sm:px-7.5 lg:px-11 relative modal-content rounded-tl-xl rounded-bl-xl h-screen flex flex-col">
          <div className="sticky z-10 top-0 bg-white pb-4 pt-4 sm:pt-7.5 lg:pt-11 border-b border-gray-3 mb-7.5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-medium text-dark text-lg sm:text-2xl">
                  Sepetim ({cart?.items.length}{" "}
                  {cart?.items.length === 1 ? "ürün" : "ürün"})
                </h2>
              </div>
              <button
                onClick={() => closeCartModal()}
                aria-label="button for close modal"
                className="w-8 h-8 rounded-full border-2 border-blue bg-white flex items-center justify-center ease-in duration-150 text-blue hover:bg-blue hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>

            {/* Price Refresh Timer - inside sticky header */}
            {cart?.items && cart.items.length > 0 && (
              <div>
                <PriceRefreshTimer intervalMinutes={3} />
              </div>
            )}
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                <p>Error loading cart: {error}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* <!-- cart item --> */}
                {cart?.items.length > 0 ? (
                  cart?.items.map((item, key) => (
                    <SingleItem
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code || "usd"}
                      onCartUpdate={fetchCart}
                    />
                  ))
                ) : (
                  <EmptyCart />
                )}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="border-t border-gray-3 bg-blue-50 pt-5 pb-4 sm:pb-7.5 lg:pb-11 mt-7.5 sticky bottom-0">
            {cart?.items.length > 0 ? (
              <>
                {/* Cart Summary */}
                <div className="space-y-4 mb-6">
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-dark font-medium">Toplam:</p>
                      <p className="text-sm text-gray-600">(KDV DAHİL)</p>
                    </div>
                    <p className="text-dark font-bold text-lg">
                      {convertToLocale({
                        amount: cart?.total || 0,
                        currency_code: cart?.currency_code || "try",
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      closeCartModal();
                      // Navigate to checkout and refresh to ensure fresh data
                      router.push(`/${countryCode}/checkout?step=address`);
                      // Small delay to ensure navigation completes before refresh
                      setTimeout(() => {
                        router.refresh();
                      }, 100);
                    }}
                    className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                  >
                    Ödeme Yap
                  </button>

                  <LocalizedClientLink
                    onClick={() => closeCartModal()}
                    href="/cart"
                    className="w-full flex justify-center font-medium text-blue bg-white border-2 border-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-50"
                  >
                    Sepete Git
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <>
                {/* Cart Summary */}
                <div className="space-y-4 mb-6">
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-dark font-medium">Toplam:</p>
                      <p className="text-sm text-gray-600">(KDV DAHİL)</p>
                    </div>
                    <p className="text-dark font-bold text-lg">
                      {convertToLocale({
                        amount: 0,
                        currency_code: cart?.currency_code || "try",
                      })}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarModal;
