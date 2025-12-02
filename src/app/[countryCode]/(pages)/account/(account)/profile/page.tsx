import Profile from "@/components/Account/AccountProfile/Profile";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil | Kmint Shop online E-ticaret şablonu",
  description: "Kmint Shopiçin Profil Sayfasıdır",
};

const ProfilePage = () => {
  return (
    <main>
      <Profile />
    </main>
  );
};

export default ProfilePage;
