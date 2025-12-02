"use client";
import React, { useState } from "react";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import SearchBar from "./SearchBar";
import MobileNavigation from "./MobileNavigation";
import MobileUserActions from "./MobileUserActions";

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-9999 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu Button - Left */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menüyü aç"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Logo - Center */}
            <LocalizedClientLink href="/" className="flex-shrink-0">
              <div className="text-2xl font-bold text-blue">Kmint Shop</div>
            </LocalizedClientLink>

            {/* Search Button - Right */}
            <button
              onClick={toggleSearch}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isSearchOpen ? "Aramayı kapat" : "Arama"}
            >
              {isSearchOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Search className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Toggle */}
        {isSearchOpen && (
          <div className="px-4 py-3 border-t border-gray-200 ">
            <SearchBar />
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-99999">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleMenu}
          />

          {/* Drawer */}
          <div className="absolute top-0 left-0 w-80 h-full bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="text-xl font-bold text-blue">Kmint Shop</div>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Menüyü kapat"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* User Actions */}
              <div className="border-b border-gray-200">
                <MobileUserActions onClose={toggleMenu} />
              </div>

              {/* Navigation */}
              <MobileNavigation onClose={toggleMenu} />
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default MobileHeader;
