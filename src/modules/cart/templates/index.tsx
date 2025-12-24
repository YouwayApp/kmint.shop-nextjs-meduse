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
        <section className="overflow-hidden py-12 sm:py-16 lg:py-20 bg-gray-2 ">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            {/* Header Section */}
            <div className="mb-8 sm:mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm sm:text-base text-dark-4">
                    {cart?.items?.length || 0}{" "}
                    {cart?.items?.length === 1 ? "ürün" : "ürün"} sepetinizde
                  </p>
                </div>
              </div>

              {/* Price Refresh Timer */}
              <PriceRefreshTimer
                intervalMinutes={3}
                textColor="text-dark"
                iconColor="text-blue"
                timeColor="text-blue"
                buttonColor="text-blue"
                buttonHoverColor="hover:text-blue-dark"
                backgroundColor="bg-white"
                borderColor="border-gray-3"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-11">
              {/* Cart Items - 8 columns */}
              <div className="lg:col-span-8">
                <div className="bg-white p-4 sm:p-6 shadow-sm border border-gray-3">
                  <h2 className="font-semibold text-lg sm:text-xl text-dark mb-6 pb-4 border-b border-gray-3">
                    Ürünler
                  </h2>
                  <div className="space-y-4">
                    <ItemsTemplate cart={cart} />
                  </div>
                </div>
              </div>

              {/* Order Summary - 4 columns */}
              <div className="lg:col-span-4">
                <div className="sticky top-4">
                  <Summary cart={cart as any} />
                </div>
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
