"use client";

import { RadioGroup } from "@headlessui/react";
import {
  isStripe as isStripeFunc,
  isIbanTransfer,
  paymentInfoMap,
} from "@lib/constants";
import { initiatePaymentSession } from "@lib/data/cart";
import { CheckCircleSolid, CreditCard } from "@medusajs/icons";
import { Button, Container, Heading, Text, clx } from "@medusajs/ui";
import ErrorMessage from "@modules/checkout/components/error-message";
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container";
import IbanPaymentDetails from "@modules/checkout/components/iban-payment-details";
import Divider from "@modules/common/components/divider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getActiveIbans, Iban } from "@lib/data/iban";

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any;
  availablePaymentMethods: any[];
}) => {
  // Debug: Log available payment methods
  useEffect(() => {
    if (availablePaymentMethods) {
      console.log("Available Payment Methods:", availablePaymentMethods);
      availablePaymentMethods.forEach((method) => {
        console.log(
          `Payment Method ID: ${method.id}, Is IBAN: ${isIbanTransfer(
            method.id
          )}`
        );
      });
    }
  }, [availablePaymentMethods]);

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  );
  const [selectedIbanId, setSelectedIbanId] = useState<string | null>(
    activeSession?.data?.iban_id || null
  );
  const [ibans, setIbans] = useState<Iban[] | null>(null);

  // Get selected IBAN ID from active session or state
  const currentIbanId = activeSession?.data?.iban_id || selectedIbanId;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "payment";

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard;

  // Eğer adres ve kargo tamamlandıysa ama ödeme yöntemi seçilmemişse, ödeme adımını açık göster
  const previousStepsCompleted =
    cart.shipping_address &&
    cart.billing_address &&
    cart.email &&
    cart.shipping_methods.length > 0;

  // Ödeme yöntemi seçilmemişse ve önceki adımlar tamamlandıysa, adımı açık göster
  const shouldShowOpen = isOpen || (previousStepsCompleted && !paymentReady);

  const isStripe = isStripeFunc(selectedPaymentMethod);

  const setPaymentMethod = async (method: string) => {
    setError(null);
    setSelectedPaymentMethod(method);
    
    // Check if shipping method is selected before creating payment session
    if (!cart?.shipping_methods || cart.shipping_methods.length === 0) {
      setError("Lütfen önce bir kargo yöntemi seçin");
      return;
    }

    // For IBAN transfer, check if IBAN is selected
    if (isIbanTransfer(method) && !selectedIbanId) {
      setError("Lütfen bir IBAN seçin");
      return;
    }
    
    // Create payment session for both Stripe and IBAN transfer
    if (isStripeFunc(method) || isIbanTransfer(method)) {
      try {
        const sessionData: any = {
          provider_id: method,
        };

        // Add IBAN ID to session data if IBAN transfer is selected
        if (isIbanTransfer(method) && selectedIbanId) {
          sessionData.data = {
            iban_id: selectedIbanId,
          };
        }

        await initiatePaymentSession(cart, sessionData);
        // Refresh to update cart with new payment session
        router.refresh();
      } catch (err: any) {
        // Check if error is about shipping profiles
        if (
          err.message?.includes("shipping profiles") ||
          err.message?.includes("shipping methods")
        ) {
          setError(
            "Seçilen kargo yöntemi sepet öğelerinizle uyumlu değil. Lütfen başka bir kargo yöntemi seçin."
          );
        } else {
          setError(err.message);
        }
      }
    }
  };

  const handleIbanSelect = (ibanId: string) => {
    setSelectedIbanId(ibanId);
    // If IBAN payment method is already selected, update the session
    if (isIbanTransfer(selectedPaymentMethod)) {
      setPaymentMethod(selectedPaymentMethod);
    }
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Check if shipping method is selected
      if (!cart?.shipping_methods || cart.shipping_methods.length === 0) {
        setError("Lütfen önce bir kargo yöntemi seçin");
        setIsLoading(false);
        return;
      }

      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession;

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod;

      // For IBAN transfer, check if IBAN is selected
      if (isIbanTransfer(selectedPaymentMethod) && !selectedIbanId) {
        setError("Lütfen bir IBAN seçin");
        setIsLoading(false);
        return;
      }

      if (!checkActiveSession) {
        const sessionData: any = {
          provider_id: selectedPaymentMethod,
        };

        // Add IBAN ID to session data if IBAN transfer is selected
        if (isIbanTransfer(selectedPaymentMethod) && selectedIbanId) {
          sessionData.data = {
            iban_id: selectedIbanId,
          };
        }

        await initiatePaymentSession(cart, sessionData);
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        );
      }
    } catch (err: any) {
      // Check if error is about shipping profiles
      if (
        err.message?.includes("shipping profiles") ||
        err.message?.includes("shipping methods")
      ) {
        setError(
          "Seçilen kargo yöntemi sepet öğelerinizle uyumlu değil. Lütfen kargo adımına dönüp başka bir kargo yöntemi seçin."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  // Fetch IBANs for displaying selected IBAN in summary
  useEffect(() => {
    const fetchIbans = async () => {
      if (
        isIbanTransfer(selectedPaymentMethod) ||
        isIbanTransfer(activeSession?.provider_id)
      ) {
        try {
          const data = await getActiveIbans();
          setIbans(data);
        } catch (error) {
          console.error("Error fetching IBANs:", error);
        }
      }
    };
    fetchIbans();
  }, [selectedPaymentMethod, activeSession?.provider_id]);

  // Update selectedIbanId when activeSession changes
  useEffect(() => {
    if (activeSession?.data?.iban_id) {
      setSelectedIbanId(activeSession.data.iban_id);
    }
  }, [activeSession?.data?.iban_id]);

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-lg sm:text-xl font-semibold text-dark gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !shouldShowOpen && !paymentReady,
            }
          )}
        >
          Ödeme Yöntemi
          {!shouldShowOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!shouldShowOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Düzenle
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={shouldShowOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      >
                        {isIbanTransfer(paymentMethod.id) &&
                          selectedPaymentMethod === paymentMethod.id && (
                            <IbanPaymentDetails
                              selectedIbanId={selectedIbanId}
                              onIbanSelect={handleIbanSelect}
                            />
                          )}
                      </PaymentContainer>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Ödeme yöntemi
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Hediye kartı
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeFunc(selectedPaymentMethod)
              ? "Kart detaylarını girin"
              : "İnceleme için devam et"}
          </Button>
        </div>

        <div className={shouldShowOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex flex-col gap-y-4 w-full">
              <div className="flex flex-col">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Ödeme yöntemi
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Ödeme detayları
                </Text>
                {isIbanTransfer(activeSession?.provider_id) ? (
                  <div
                    className="flex flex-col gap-1 txt-medium text-ui-fg-subtle"
                    data-testid="payment-details-summary"
                  >
                    {(() => {
                      const sessionIbanId = currentIbanId;
                      const selectedIban =
                        ibans?.find((iban) => iban.id === sessionIbanId) ||
                        ibans?.find((iban) => iban.isDefault) ||
                        ibans?.[0];

                      if (selectedIban) {
                        return (
                          <>
                            <Text className="txt-medium text-ui-fg-base">
                              {selectedIban.bankName}
                              {selectedIban.branchName &&
                                ` - ${selectedIban.branchName}`}
                            </Text>
                            <Text className="txt-small text-ui-fg-subtle font-mono">
                              {selectedIban.iban}
                            </Text>
                            <Text className="txt-small text-ui-fg-subtle">
                              {selectedIban.accountHolderName}
                            </Text>
                          </>
                        );
                      }
                      return (
                        <Text className="txt-medium text-ui-fg-subtle">
                          IBAN bilgileri yükleniyor...
                        </Text>
                      );
                    })()}
                  </div>
                ) : (
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Başka bir adım görünecek"}
                  </Text>
                </div>
                )}
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Ödeme yöntemi
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Hediye kartı
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

export default Payment;
