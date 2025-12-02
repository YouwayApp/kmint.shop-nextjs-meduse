"use client";

import Header from "@/components/Global/Header";
import Footer from "@/components/Global/Footer";

import "../../css/euclid-circular-a-font.css";
import "../../css/style.css";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
