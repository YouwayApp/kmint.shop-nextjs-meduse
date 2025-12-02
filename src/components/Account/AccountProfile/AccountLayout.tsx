"use client";
import React from "react";
import { HttpTypes } from "@medusajs/types";

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null;
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
