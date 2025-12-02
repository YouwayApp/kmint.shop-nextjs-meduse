import OrderDetails from "@/components/Account/AccountProfile/OrderDetails";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sipariş Detayları | Online gram online E-ticaret şablonu",
  description: "Bu NextCommerce Şablonu için Sipariş Detayları Sayfasıdır",
};

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = await params;
  return (
    <main>
      <OrderDetails params={resolvedParams} />
    </main>
  );
};

export default OrderDetailsPage;
