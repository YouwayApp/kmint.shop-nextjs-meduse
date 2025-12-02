import React from "react";
import Image from "next/image";

const featureData = [
  {
    img: "/images/icons/box-svgrepo-com.svg",
    title: "Kurye ile Teslimat",
    description: "Hızlı ve güvenli teslimat",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "Aynı gün kargo",
    description: "Hızlı ve güvenli kargo",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "100% Güvenli Alışveriş",
    description: "Güvenli ve güvenilir alışveriş",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "24/7 kesintisiz Destek",
    description: "Kesintisiz destek alın",
  },
];

const HeroFeature = () => {
  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7.5 xl:gap-12.5 mt-10">
        {featureData.map((item, key) => (
          <div className="flex items-center gap-4" key={key}>
            <Image src={item.img} alt="icons" width={40} height={41} />

            <div>
              <h3 className="font-medium text-sm sm:text-sm text-dark">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
