import ForgotPassword from "@/components/Account/Auth/ForgotPassword";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şifremi Unuttum | Kmint Shop online E-ticaret şablonu",
  description: "Kmint Shopiçin Şifremi Unuttum Sayfasıdır",
};

const ForgotPasswordPage = () => {
  return (
    <main>
      <ForgotPassword />
    </main>
  );
};

export default ForgotPasswordPage;
