"use client";
import React from "react";
import LocalizedClientLink from "../../Meduse/localized-client-link";

import Dropdown from "./Dropdown";
import { useCategories } from "@/providers/SiteProvider";

interface NavigationProps {
  navigationOpen: boolean;
  stickyMenu: boolean;
  setNavigationOpen: (open: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  navigationOpen,
  stickyMenu,
  setNavigationOpen,
}) => {
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
    <div
      className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between ${
        navigationOpen &&
        `!visible bg-white shadow-lg border border-gray-3 !h-auto max-h-[400px] overflow-y-scroll p-5`
      }`}
    >
      {/* Main Nav Start */}
      <nav>
        <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-6">
          {menuData.map((menuItem, i) =>
            menuItem.submenu ? (
              <Dropdown key={i} menuItem={menuItem} stickyMenu={stickyMenu} />
            ) : (
              <li
                key={i}
                className="group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:ease-out before:duration-200 hover:before:w-full "
              >
                <LocalizedClientLink
                  href={menuItem.path}
                  className={`hover:text-blue text-custom-sm font-medium text-dark flex ${
                    stickyMenu ? "xl:py-4" : "xl:py-6"
                  }`}
                >
                  {menuItem.title}
                </LocalizedClientLink>
              </li>
            )
          )}
        </ul>
      </nav>
      {/* Main Nav End */}
    </div>
  );
};

export default Navigation;
