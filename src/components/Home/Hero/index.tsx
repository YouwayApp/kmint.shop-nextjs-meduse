import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import Banners from "./Banners";
import SliderHome from "../Slider";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-18.5 xl:pb-15 pt-12 sm:pt-45 lg:pt-30 xl:pt-56 bg-[#f4f4f4]">
      <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
        <SliderHome />
      </div>
    </section>
  );
};

export default Hero;
