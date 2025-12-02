import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mağaza Detayları Sayfası | Kmint Shop online E-ticaret şablonu",
  description: "Kmint Shopiçin Mağaza Detayları Sayfasıdır",
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
