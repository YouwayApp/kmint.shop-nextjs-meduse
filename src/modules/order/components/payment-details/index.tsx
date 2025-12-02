import { Container, Heading, Text } from "@medusajs/ui"

import { isIbanTransfer, isStripe, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  // Try to get payment from different possible locations
  const payment = order.payment_collections?.[0]?.payments?.[0] || 
                  (order as any).payments?.[0] ||
                  (order as any).payment

  if (!payment) {
    return null
  }

  const isIban = isIbanTransfer(payment.provider_id)
  // Payment data might be in different locations
  const paymentData = payment.data as any || (payment as any).session_data || {}

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Ödeme Bilgileri
      </Heading>
      <div>
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex flex-col">
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              Ödeme Yöntemi
            </Text>
            <Text
              className="txt-medium text-ui-fg-subtle"
              data-testid="payment-method"
            >
              {paymentInfoMap[payment.provider_id]?.title || payment.provider_id}
            </Text>
          </div>
          <div className="flex flex-col">
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              Ödeme Detayları
            </Text>
            {isIban ? (
              <div className="p-4 bg-ui-bg-subtle rounded-md border border-ui-border-base">
                <div className="flex flex-col gap-3">
                  {paymentData?.bankName && (
                    <div>
                      <Text className="txt-small text-ui-fg-subtle mb-1">Banka:</Text>
                      <Text className="txt-medium text-ui-fg-base">
                        {paymentData.bankName}
                        {paymentData.branchName && ` - ${paymentData.branchName}`}
                      </Text>
                    </div>
                  )}
                  {paymentData?.iban && (
                    <div>
                      <Text className="txt-small text-ui-fg-subtle mb-1">IBAN:</Text>
                      <Text className="txt-medium text-ui-fg-base font-mono">
                        {paymentData.iban}
                      </Text>
                    </div>
                  )}
                  {paymentData?.accountHolderName && (
                    <div>
                      <Text className="txt-small text-ui-fg-subtle mb-1">Hesap Sahibi:</Text>
                      <Text className="txt-medium text-ui-fg-base">
                        {paymentData.accountHolderName}
                      </Text>
                    </div>
                  )}
                  {!paymentData?.iban && !paymentData?.bankName && (
                    <div>
                      <Text className="txt-medium text-ui-fg-subtle">
                        IBAN ile havale ödeme yöntemi seçildi. Ödeme bilgileri yakında eklenecek.
                      </Text>
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t border-ui-border-base">
                    <Text className="txt-small text-ui-fg-subtle mb-1">Ödenecek Tutar:</Text>
                    <Text className="txt-medium-plus text-ui-fg-base font-semibold">
                      {convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })}
                    </Text>
                  </div>
                  <div className="mt-2 pt-2 border-t border-ui-border-base">
                    <Text className="txt-small text-ui-fg-muted">
                      Lütfen ödeme yaparken açıklama kısmına sipariş numaranızı yazmayı unutmayın.
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                  {paymentInfoMap[payment.provider_id]?.icon}
                </Container>
                <Text data-testid="payment-amount">
                  {isStripe(payment.provider_id) && paymentData?.card_last4
                    ? `**** **** **** ${paymentData.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString("tr-TR")} tarihinde ödendi`}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
