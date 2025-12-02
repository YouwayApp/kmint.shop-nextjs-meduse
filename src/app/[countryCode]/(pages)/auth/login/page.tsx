import Signin from "@/components/Account/Auth/Signin";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş | Online gram online E-ticaret şablonu",
  description: "Bu NextCommerce Şablonu için Giriş Sayfasıdır",
};

const LoginPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default LoginPage;
