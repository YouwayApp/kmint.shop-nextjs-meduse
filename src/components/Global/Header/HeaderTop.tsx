"use client";
import React, { useState } from "react";
import Image from "next/image";
import LocalizedClientLink from "../../Meduse/localized-client-link";
import SearchBar from "./SearchBar";
import ContactInfo from "./ContactInfo";
import UserActions from "./UserActions";

interface HeaderTopProps {
  stickyMenu: boolean;
}

const HeaderTop: React.FC<HeaderTopProps> = ({ stickyMenu }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <div
        className={`relative flex flex-col lg:flex-row gap-5 items-end lg:items-center ease-out duration-200 ${
          stickyMenu ? "py-4" : "py-6"
        }`}
      >
        {/* Header top left - Contact Info */}
        <div className="flex-1 flex items-center">
          <ContactInfo />
        </div>

        {/* Header top center - Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <LocalizedClientLink className="flex-shrink-0" href="/">
            <Image src="/logo/logo.svg" alt="Logo" width={120} height={35} />
          </LocalizedClientLink>
        </div>

        {/* Header top right */}
        <div className="flex-1 flex justify-end items-center gap-7.5">
          {/* Search Icon */}
          <button
            onClick={toggleSearch}
            className="p-2 hover:bg-gray-1 transition-colors"
            aria-label={isSearchOpen ? "Aramayı kapat" : "Arama"}
          >
            {isSearchOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-dark"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-dark"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {/* User Actions - Sepet ve Hesap (her zaman görünür) */}
          <UserActions />
        </div>
      </div>

      {/* Search Bar - Toggle */}
      {isSearchOpen && (
        <div className="pb-4 border-t border-gray-3 pt-4">
          <SearchBar />
        </div>
      )}
    </>
  );
};

export default HeaderTop;
