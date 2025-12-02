import { listCartShippingMethods } from "@lib/data/fulfillment";
import { listCartPaymentMethods } from "@lib/data/payment";
import { HttpTypes } from "@medusajs/types";
import Addresses from "@modules/checkout/components/addresses";
import Payment from "@modules/checkout/components/payment";
import Review from "@modules/checkout/components/review";
import Shipping from "@modules/checkout/components/shipping";

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
}) {
  if (!cart) {
    return null;
  }

  // Fetch shipping and payment methods, but don't block rendering if they fail
  let shippingMethods = null;
  let paymentMethods = null;

  try {
    shippingMethods = await listCartShippingMethods(cart.id);
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
  }

  try {
    paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "");
  } catch (error) {
    console.error("Error fetching payment methods:", error);
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      {shippingMethods && (
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      )}

      {paymentMethods && (
        <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      )}
    </div>
  );
}
