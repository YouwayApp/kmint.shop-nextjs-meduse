import React from "react";
import Image from "next/image";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- 2 banner gird --> */}
        <div className="grid gap-4 sm:gap-7.5 grid-cols-2 lg:grid-cols-2">
          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden bg-[#DBF4F3] ">
            <LocalizedClientLink href="/categories/gumus">
              <img src="/banners/new/7.png" alt=" " />
            </LocalizedClientLink>
          </div>

          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden bg-[#FFECE1]">
            <LocalizedClientLink href="/categories/gram-kulce-altin">
              <img src="/banners/new/9.png" alt=" " />
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
