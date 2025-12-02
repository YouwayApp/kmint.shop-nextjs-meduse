import ResetPassword from "@/components/Account/Auth/ResetPassword";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şifre Sıfırla | Online gram online E-ticaret şablonu",
  description: "Bu NextCommerce Şablonu için Şifre Sıfırlama Sayfasıdır",
};

const ResetPasswordPage = () => {
  return (
    <main>
      <ResetPassword />
    </main>
  );
};

export default ResetPasswordPage;
