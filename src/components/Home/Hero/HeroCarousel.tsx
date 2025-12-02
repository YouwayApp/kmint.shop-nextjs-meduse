"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      <SwiperSlide>
        <div className="w-full overflow-hidden rounded-lg">
          <img
            src="/slider/new/1.png"
            alt="hero"
            className="w-full h-auto object-contain"
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="w-full overflow-hidden rounded-lg">
          <img
            src="/slider/new/2.png"
            alt="hero"
            className="w-full h-auto object-contain"
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="w-full overflow-hidden rounded-lg">
          <img
            src="/slider/new/3.png"
            alt="hero"
            className="w-full h-auto object-contain"
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="w-full overflow-hidden rounded-lg">
          <img
            src="/slider/new/4.png"
            alt="hero"
            className="w-full h-auto object-contain"
          />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;
