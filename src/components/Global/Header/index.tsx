"use client";
import React, { useState, useEffect } from "react";
import TopHeader from "./TopHeader";
import HeaderTop from "./HeaderTop";
import Navigation from "./Navigation";
import NavRight from "./NavRight";
import MobileToggle from "./MobileToggle";
import MobileHeader from "./MobileHeader";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Header */}
      <header
        className={`hidden lg:block fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 ${
          stickyMenu && "shadow"
        }`}
      >
        {/* Top Header */}
        <TopHeader />

        <div className="max-w-[1170px]  mx-auto px-4 sm:px-7.5 xl:px-0">
          {/* Header top */}
          <HeaderTop stickyMenu={stickyMenu} />
        </div>

        <div className="border-t border-b border-gray-3">
          <div className="max-w-[1170px]  mx-auto px-4 sm:px-7.5 xl:px-0">
            <div className="flex items-center justify-between">
              {/* Main Navigation */}
              <Navigation
                navigationOpen={navigationOpen}
                stickyMenu={stickyMenu}
                setNavigationOpen={setNavigationOpen}
              />

              {/* Nav Right */}
              <NavRight />

              {/* Mobile Toggle */}
              <MobileToggle
                navigationOpen={navigationOpen}
                setNavigationOpen={setNavigationOpen}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
