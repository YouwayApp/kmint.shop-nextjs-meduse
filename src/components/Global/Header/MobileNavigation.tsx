"use client";
import React from "react";
import LocalizedClientLink from "../../Meduse/localized-client-link";
import { useCategories } from "@/providers/SiteProvider";
import {
  Home,
  Grid3X3,
  Info,
  Phone,
  ShoppingBag,
  Heart,
  User,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface MobileNavigationProps {
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ onClose }) => {
  const menuData = [];
  const categories = useCategories();
  const rootCategories = categories.getRootCategories();

  rootCategories.forEach((category) => {
    menuData.push({
      id: category.id,
      title: category.name,
      path: `/categories/${category.handle}`,
    });
  });

  return (
    <nav className="flex-1 overflow-y-auto py-8 px-4">
      <ul className="space-y-1">
        {/* Ana Sayfa */}
        <li>
          <LocalizedClientLink
            href="/"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue transition-colors rounded-lg"
          >
            <Home className="w-5 h-5 mr-3" />
            Ana Sayfa
          </LocalizedClientLink>
        </li>

        {/* Kategoriler */}
        {menuData.map((menuItem, i) => (
          <li key={i}>
            <LocalizedClientLink
              href={menuItem.path}
              onClick={onClose}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue transition-colors rounded-lg"
            >
              <ArrowRight className="w-5 h-5 mr-3" />
              {menuItem.title}
            </LocalizedClientLink>
          </li>
        ))}

        {/* Diğer Sayfalar */}
        <li>
          <LocalizedClientLink
            href="/about"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue transition-colors rounded-lg"
          >
            <Info className="w-5 h-5 mr-3" />
            Hakkımızda
          </LocalizedClientLink>
        </li>

        <li>
          <LocalizedClientLink
            href="/contact"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue transition-colors rounded-lg"
          >
            <Phone className="w-5 h-5 mr-3" />
            İletişim
          </LocalizedClientLink>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavigation;
