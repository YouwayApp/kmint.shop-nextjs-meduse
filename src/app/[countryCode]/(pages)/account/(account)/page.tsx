import Dashboard from "@/components/Account/AccountProfile/Dashboard";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesap Paneli | Kmint Shop online E-ticaret şablonu",
  description: "Kmint Shopiçin Hesap Paneli sayfasıdır",
};

const AccountPage = () => {
  return (
    <main>
      <Dashboard />
    </main>
  );
};

export default AccountPage;
