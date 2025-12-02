"use client";

import React, { useState, useEffect } from "react";
import { retrieveCustomer } from "@lib/data/customer";
import { useParams, usePathname } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import AccountSidebar from "@/components/Account/AccountSidebar";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const { countryCode } = useParams();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await retrieveCustomer();
        setCustomer(customerData);
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const getBreadcrumbData = () => {
    if (
      pathname === `/${countryCode}/account` ||
      pathname === `/${countryCode}/account/`
    ) {
      return { title: "Hesabım", pages: ["Hesabım"] };
    } else if (pathname === `/${countryCode}/account/profile`) {
      return { title: "Profil", pages: ["Profil"] };
    } else if (pathname === `/${countryCode}/account/addresses`) {
      return { title: "Adresler", pages: ["Adresler"] };
    } else if (pathname === `/${countryCode}/account/orders`) {
      return { title: "Siparişler", pages: ["Siparişler"] };
    } else if (pathname.startsWith(`/${countryCode}/account/orders/details/`)) {
      return {
        title: "Sipariş Detayları",
        pages: ["Siparişler", "Sipariş Detayları"],
      };
    }
    return { title: "Hesap", pages: ["Hesap"] };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const breadcrumbData = getBreadcrumbData();

  return (
    <>
      <Breadcrumb title={breadcrumbData.title} pages={breadcrumbData.pages} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Account Sidebar */}
            <AccountSidebar customer={customer} />

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-9">
              {children}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountLayout;
