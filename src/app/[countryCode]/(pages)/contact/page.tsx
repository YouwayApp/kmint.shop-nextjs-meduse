import Contact from "@/components/Contact";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "İletişim Sayfası | Online gram online E-ticaret şablonu",
  description: "Bu NextCommerce Şablonu için İletişim Sayfasıdır",
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
