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
    <div className="bg-gray-2 min-h-screen">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-7.5 xl:px-0 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-11">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white shadow-lg border border-gray-3 p-6 sm:p-8">
              <h1 className="font-semibold text-2xl sm:text-3xl text-dark mb-6 pb-4 border-b border-gray-3">
                Ödeme Bilgileri
              </h1>
              <PaymentWrapper cart={cart}>
                <CheckoutForm cart={cart} customer={customer} />
              </PaymentWrapper>
            </div>

            {/* Review Section */}
            <div className="mt-6 lg:mt-8">
              <div className="bg-white shadow-lg border border-gray-3 p-6 sm:p-8">
                <Review cart={cart} />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="lg:sticky lg:top-4">
              <div className="bg-white shadow-lg border border-gray-3">
                <div className="border-b border-gray-3 px-6 py-5">
                  <h2 className="font-semibold text-xl sm:text-2xl text-dark">
                    Sipariş Özeti
                  </h2>
                </div>
                <div className="p-6 sm:p-8">
                  <CheckoutSummary cart={cart} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
