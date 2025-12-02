import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mağaza Detayları Sayfası | Online gram online E-ticaret şablonu",
  description: "Bu NextCommerce Şablonu için Mağaza Detayları Sayfasıdır",
  // other metadata
};

const ShopDetailsPage = () => {
  return (
    <main>
      <ShopDetails />
    </main>
  );
};

export default ShopDetailsPage;
