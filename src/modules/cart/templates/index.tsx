import ItemsTemplate from "./items";
import Summary from "./summary";
import EmptyCartMessage from "../components/empty-cart-message";
import SignInPrompt from "../components/sign-in-prompt";
import Divider from "@modules/common/components/divider";
import Breadcrumb from "@/components/Common/Breadcrumb";
import PriceRefreshTimer from "../components/price-refresh-timer";
import { HttpTypes } from "@medusajs/types";

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
}) => {
  return (
    <>
      {/* Breadcrumb Section */}
      <section>
        <Breadcrumb title={"Sepet"} pages={["Sepet"]} />
      </section>

      {cart?.items?.length ? (
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <h2 className="font-medium text-dark text-2xl">Sepetiniz</h2>
            </div>

            {/* Price Refresh Timer */}
            <div className="mb-6">
              <PriceRefreshTimer intervalMinutes={3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7.5 xl:gap-11">
              {/* Cart Items - 8 columns */}
              <div className="lg:col-span-8">
                <div className="space-y-4">
                  {/* Cart items as individual cards */}
                  <ItemsTemplate cart={cart} />
                </div>
              </div>

              {/* Order Summary - 4 columns */}
              <div className="lg:col-span-4">
                <Summary cart={cart as any} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <EmptyCartMessage />
      )}
    </>
  );
};

export default CartTemplate;
