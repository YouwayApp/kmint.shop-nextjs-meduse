import Orders from "@/components/Account/AccountProfile/Orders";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Siparişler | Kmint Shop online E-ticaret şablonu",
  description: "Kmint Shopiçin Siparişler Sayfasıdır",
};

const OrdersPage = () => {
  return (
    <main>
      <Orders />
    </main>
  );
};

export default OrdersPage;
