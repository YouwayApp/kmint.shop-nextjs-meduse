"use client";
import React from "react";
import Image from "next/image";
import LocalizedClientLink from "../../Meduse/localized-client-link";
import SearchBar from "./SearchBar";
import ContactInfo from "./ContactInfo";
import UserActions from "./UserActions";

interface HeaderTopProps {
  stickyMenu: boolean;
}

const HeaderTop: React.FC<HeaderTopProps> = ({ stickyMenu }) => {
  return (
    <div
      className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${
        stickyMenu ? "py-4" : "py-6"
      }`}
    >
      {/* Header top left */}
      <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
        <LocalizedClientLink className="flex-shrink-0" href="/">
          <Image src="/logo/logo.svg" alt="Logo" width={100} height={28} />
        </LocalizedClientLink>

        <SearchBar />
      </div>

      {/* Header top right */}
      <div className="flex w-full lg:w-auto items-center gap-7.5">
        <ContactInfo />

        <span className="hidden xl:block w-px h-7.5 bg-gray-4"></span>

        <UserActions />
      </div>
    </div>
  );
};

export default HeaderTop;
