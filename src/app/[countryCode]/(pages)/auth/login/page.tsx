import Signin from "@/components/Account/Auth/Signin";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş | Kmint Shop online E-ticaret şablonu",
  description: "Kmint Shopiçin Giriş Sayfasıdır",
};

const LoginPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default LoginPage;
