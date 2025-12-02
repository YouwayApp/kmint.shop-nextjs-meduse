import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import MobileCartBar from "@/components/Common/MobileCartBar";
import { SiteProvider } from "@/providers/SiteProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online gram altın",
  description: "Online gram altın",
  icons: {
    icon: "/logo/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning={true}>
      <body>
        <>
          <AuthProvider>
            <SiteProvider>
              <ReduxProvider>
                <CartProvider>
                  <CartModalProvider>
                    <ModalProvider>
                      <PreviewSliderProvider>
                        {children}
                        <QuickViewModal />
                        <CartSidebarModal />
                        <PreviewSliderModal />
                        <MobileCartBar />
                      </PreviewSliderProvider>
                    </ModalProvider>
                  </CartModalProvider>
                </CartProvider>
              </ReduxProvider>
              <ScrollToTop />
            </SiteProvider>
          </AuthProvider>
        </>
      </body>
    </html>
  );
}
