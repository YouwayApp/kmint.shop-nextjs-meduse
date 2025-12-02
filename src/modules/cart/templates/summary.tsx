"use client";

import CartTotals from "@modules/common/components/cart-totals";
import DiscountCode from "@modules/checkout/components/discount-code";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { HttpTypes } from "@medusajs/types";

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[];
  };
};

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address";
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery";
  } else {
    return "payment";
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart);

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* Order Summary Box */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Sipariş Özeti</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* Discount Code */}
          <div className="py-4">
            <DiscountCode cart={cart} />
          </div>

          <div className="h-px w-full border-b border-gray-3  mb-4"></div>

          {/* Cart Totals */}
          <CartTotals totals={cart} />

          {/* Checkout Button */}
          <LocalizedClientLink
            href={"/checkout?step=" + step}
            data-testid="checkout-button"
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            Ödemeye Geç
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  );
};

export default Summary;
