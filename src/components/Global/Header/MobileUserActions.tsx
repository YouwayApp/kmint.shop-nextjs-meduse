"use client";
import React from "react";
import LocalizedClientLink from "../../Meduse/localized-client-link";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { useAuth } from "@/providers/AuthProvider";
import {
  User,
  ShoppingCart,
  Heart,
  Search,
  LogIn,
  UserCircle,
} from "lucide-react";

interface MobileUserActionsProps {
  onClose: () => void;
}

const MobileUserActions: React.FC<MobileUserActionsProps> = ({ onClose }) => {
  const { customer, loading: isLoading } = useAuth();
  const { openCartModal } = useCartModalContext();
  const totalPrice = useSelector(selectTotalPrice);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-4 p-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-6 p-4">
      {/* Hesap */}
      <LocalizedClientLink
        href="/account"
        onClick={onClose}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        {customer ? (
          <UserCircle className="w-5 h-5 text-blue" />
        ) : (
          <LogIn className="w-5 h-5 text-gray-700" />
        )}
      </LocalizedClientLink>

      {/* Sepet */}
      <button
        onClick={openCartModal}
        className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <ShoppingCart className="w-5 h-5 text-gray-700" />
        {totalPrice > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue text-white text-xs rounded-full flex items-center justify-center">
            {totalPrice}
          </span>
        )}
      </button>
    </div>
  );
};

export default MobileUserActions;
