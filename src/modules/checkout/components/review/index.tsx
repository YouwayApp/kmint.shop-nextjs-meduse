"use client";

import { Heading, Text, clx } from "@medusajs/ui";

import PaymentButton from "../payment-button";
import { useSearchParams } from "next/navigation";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams();

  const isOpen = searchParams.get("step") === "review";

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard);

  // Eğer tüm adımlar tamamlandıysa, review adımını aktif göster
  const shouldShowActive = isOpen || previousStepsCompleted;

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !shouldShowActive,
            }
          )}
        >
          Sözleşme Onayı
        </Heading>
      </div>
      {shouldShowActive && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Sipariş Ver butonuna tıklayarak,{" "}
                <LocalizedClientLink
                  href="/page/kullanim-sartlari"
                  target="_blank"
                  className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                >
                  Kullanım Şartları
                </LocalizedClientLink>
                ,{" "}
                <LocalizedClientLink
                  href="/page/satis-sartlari-ve-iade-politikasi"
                  target="_blank"
                  className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                >
                  Satış Şartları ve İade Politikası
                </LocalizedClientLink>{" "}
                okuduğunuzu, anladığınızı ve kabul ettiğinizi onaylamış
                olursunuz ve{" "}
                <LocalizedClientLink
                  href="/page/mesafeli-satis-sozlesmesi"
                  target="_blank"
                  className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                >
                  Mesafeli satış sözleşmesını
                </LocalizedClientLink>{" "}
                okuduğunuzu kabul etmiş olursunuz.
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  );
};

export default Review;
