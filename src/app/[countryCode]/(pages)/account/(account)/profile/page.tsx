import Profile from "@/components/Account/AccountProfile/Profile";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil | Online gram online E-ticaret şablonu",
  description: "Bu NextCommerce Şablonu için Profil Sayfasıdır",
};

const ProfilePage = () => {
  return (
    <main>
      <Profile />
    </main>
  );
};

export default ProfilePage;
