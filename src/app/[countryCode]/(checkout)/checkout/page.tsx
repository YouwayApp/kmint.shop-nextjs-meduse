import Review from "@/modules/checkout/components/review";
import { retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import PaymentWrapper from "@modules/checkout/components/payment-wrapper";
import CheckoutForm from "@modules/checkout/templates/checkout-form";
import CheckoutSummary from "@modules/checkout/templates/checkout-summary";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Ödeme",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Checkout() {
  const cart = await retrieveCart();

  if (!cart) {
    return notFound();
  }

  const customer = await retrieveCustomer();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 content-container gap-x-8 py-12">
      <div className="lg:col-span-6">
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
      </div>
      <div className="lg:col-span-6">
        <div className=" w-full">
          {/* Order Summary Box */}
          <div className="bg-white shadow-1 rounded-[10px] border border-gray-3 mt-4">
            <div className=" px-4 sm:px-8.5">
              <CheckoutSummary cart={cart} />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-12">
        <div className="mt-4">
          <Review cart={cart} />
        </div>
      </div>
    </div>
  );
}
