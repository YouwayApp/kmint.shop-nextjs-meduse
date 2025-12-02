import Orders from "@/components/Account/AccountProfile/Orders";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Siparişler | Online gram online E-ticaret şablonu",
  description: "Bu NextCommerce Şablonu için Siparişler Sayfasıdır",
};

const OrdersPage = () => {
  return (
    <main>
      <Orders />
    </main>
  );
};

export default OrdersPage;
