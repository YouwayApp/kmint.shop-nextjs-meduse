import React from "react";
import { CreditCard } from "@medusajs/icons";

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <CreditCard />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
  "pp_iban-transfer_iban-transfer": {
    title: "IBAN ile Havale",
    icon: <CreditCard />,
  },
  // Add more payment providers here
};

// Stripe has been removed - this function is kept for backward compatibility but always returns false
export const isStripe = (providerId?: string) => {
  return false;
};
export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal");
};
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default");
};
export const isIbanTransfer = (providerId?: string) => {
  return providerId?.startsWith("pp_iban-transfer");
};

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
];
