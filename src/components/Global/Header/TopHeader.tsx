"use client";
import React from "react";
import LocalizedClientLink from "../../Meduse/localized-client-link";
import { useAuth } from "@/providers/AuthProvider";

const TopHeader: React.FC = () => {
  const { customer } = useAuth();

  // Sol menü öğeleri
  const leftMenuItems = [
    { title: "Hakkımızda", path: "/hakkimizda" },
    { title: "İletişim", path: "/iletisim" },
    { title: "SSS", path: "/sss" },
  ];

  // Sağ menü öğeleri
  const rightMenuItems = [
    { title: "Kargo Takibi", path: "/kargo-takibi" },
    { title: "İade & Değişim", path: "/iade-degisim" },
    { title: "Gizlilik Politikası", path: "/gizlilik-politikasi" },
  ];

  return (
    <div className="hidden lg:block bg-gray-1 border-b border-gray-3">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <div className="flex items-center justify-between py-2">
          {/* Sol Menü */}
          <nav>
            <ul className="flex items-center gap-6">
              {leftMenuItems.map((item, index) => (
                <li key={index}>
                  <LocalizedClientLink
                    href={item.path}
                    className="text-custom-xs text-dark-4 hover:text-blue transition-colors"
                  >
                    {item.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sağ Menü */}
          <nav>
            <ul className="flex items-center gap-6">
              {rightMenuItems.map((item, index) => (
                <li key={index}>
                  <LocalizedClientLink
                    href={item.path}
                    className="text-custom-xs text-dark-4 hover:text-blue transition-colors"
                  >
                    {item.title}
                  </LocalizedClientLink>
                </li>
              ))}
              {/* Giriş Yap Button */}
              {!customer && (
                <li>
                  <LocalizedClientLink
                    href="/account"
                    className="px-4 py-2 border border-gray-3 bg-white text-dark font-medium text-custom-xs hover:bg-gray-1 transition-colors"
                  >
                    GİRİŞ YAP
                  </LocalizedClientLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

