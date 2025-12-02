import Dashboard from "@/components/Account/AccountProfile/Dashboard";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesap Paneli | Online gram online E-ticaret şablonu",
  description: "Bu NextCommerce Şablonu için Hesap Paneli sayfasıdır",
};

const AccountPage = () => {
  return (
    <main>
      <Dashboard />
    </main>
  );
};

export default AccountPage;
