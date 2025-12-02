import Signup from "@/components/Account/Auth/Signup";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol | Kmint Shop online E-ticaret şablonu",
  description: "Kmint Shopiçin Kayıt Sayfasıdır",
};

const RegisterPage = () => {
  return (
    <main>
      <Signup />
    </main>
  );
};

export default RegisterPage;
