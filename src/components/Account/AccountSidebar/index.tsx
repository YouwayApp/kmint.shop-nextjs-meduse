"use client";

import React from "react";
import { usePathname, useParams } from "next/navigation";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import { Button } from "@/components/UI";
import { signout } from "@lib/data/customer";
import {
  LayoutDashboard,
  User,
  MapPin,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useAuthActions } from "@/providers/AuthProvider";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface AccountSidebarProps {
  customer: any;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ customer }) => {
  const pathname = usePathname();
  const { countryCode } = useParams();

  const sidebarLinks: SidebarLink[] = [
    {
      href: "/account",
      label: "Panel",
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: "/account/profile",
      label: "Profil",
      icon: <User size={20} />,
    },
    {
      href: "/account/addresses",
      label: "Adresler",
      icon: <MapPin size={20} />,
    },
    {
      href: "/account/orders",
      label: "Siparişler",
      icon: <ShoppingBag size={20} />,
    },
  ];

  const isActive = (href: string) => {
    const fullPath = `/${countryCode}${href}`;
    if (href === "/account") {
      return (
        pathname === `/${countryCode}/account` ||
        pathname === `/${countryCode}/account/`
      );
    }
    if (href === "/account/orders") {
      return (
        pathname === `/${countryCode}/account/orders` ||
        pathname.startsWith(`/${countryCode}/account/orders/`)
      );
    }
    return pathname === fullPath;
  };

  const { logout } = useAuthActions();

  const handleSignOut = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="xl:max-w-[280px] w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-col">
        {/* User Info */}
        <div className="flex flex-col items-center gap-4 py-8 px-6 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#b8860a] to-[#7a5700] flex items-center justify-center shadow-md ring-4 ring-white">
              {customer?.avatar_url || customer?.metadata?.avatar_url ? (
                <img
                  src={customer?.avatar_url || customer?.metadata?.avatar_url}
                  alt={`${customer?.first_name} ${customer?.last_name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-2xl font-bold text-white">${(
                        customer?.first_name?.charAt(0) || "U"
                      ).toUpperCase()}</span>`;
                    }
                  }}
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {(customer?.first_name?.charAt(0) || "U").toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="text-center w-full">
            <h3 className="font-semibold text-base text-gray-900 mb-2">
              {customer?.first_name} {customer?.last_name}
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <span>
                Üye Olma Tarihi{" "}
                {customer?.created_at &&
                  new Date(customer?.created_at).toLocaleDateString("tr-TR", {
                    month: "short",
                    year: "numeric",
                  })}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4">
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <LocalizedClientLink
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-[#b8860a] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#b8860a]"
                  }`}
                >
                  <div
                    className={`${
                      active ? "text-white" : "text-gray-500"
                    } transition-colors`}
                  >
                    {link.icon}
                  </div>
                  <span
                    className={`text-sm ${
                      active ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {link.label}
                  </span>
                </LocalizedClientLink>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium text-sm"
            >
              <LogOut size={18} className="text-red-600" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;
