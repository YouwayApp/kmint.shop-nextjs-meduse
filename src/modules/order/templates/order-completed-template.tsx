import { Heading } from "@medusajs/ui";
import { cookies as nextCookies } from "next/headers";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import ChevronDown from "@modules/common/icons/chevron-down";

import CartTotals from "@modules/common/components/cart-totals";
import Help from "@modules/order/components/help";
import Items from "@modules/order/components/items";
import OnboardingCta from "@modules/order/components/onboarding-cta";
import OrderDetails from "@modules/order/components/order-details";
import ShippingDetails from "@modules/order/components/shipping-details";
import PaymentDetails from "@modules/order/components/payment-details";
import { HttpTypes } from "@medusajs/types";

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder;
  countryCode?: string;
};

export default async function OrderCompletedTemplate({
  order,
  countryCode = "tr",
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies();

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true";

  return (
    <div className="w-full bg-white relative">
      <div className="h-16 bg-white border-b">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/"
            className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
            data-testid="back-to-home-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              Anasayfaya dön
            </span>
            <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              Geri
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base"
            data-testid="store-link"
          >
            Online Gram Altın
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative">
        <div className="py-6 min-h-[calc(100vh-64px)]">
          <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
            {isOnboarding && <OnboardingCta orderId={order.id} />}
            <div
              className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
              data-testid="order-complete-container"
            >
              <Heading
                level="h1"
                className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
              >
                <span>Teşekkürler!</span>
                <span>Siparişiniz başarıyla oluşturuldu.</span>
              </Heading>
              <OrderDetails order={order} />
              <Heading level="h2" className="flex flex-row text-3xl-regular">
                Özet
              </Heading>
              <Items order={order} />
              <CartTotals totals={order} />
              <ShippingDetails order={order} />
              <PaymentDetails order={order} />
              <Help />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
