import Contact from "@/components/Contact";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "İletişim Sayfası | Kmint Shop online E-ticaret şablonu",
  description: "Kmint Shopiçin İletişim Sayfasıdır",
  // other metadata
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
