import Signup from "@/components/Account/Auth/Signup";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol | Online gram online E-ticaret şablonu",
  description: "Bu NextCommerce Şablonu için Kayıt Sayfasıdır",
};

const RegisterPage = () => {
  return (
    <main>
      <Signup />
    </main>
  );
};

export default RegisterPage;
