"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

function SliderHome() {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const slide = (image: string, title: string) => {
    return (
      <div className="w-full max-h-[574px] h-full bg-blue ">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
    );
  };

  return (
    <div className="slider-container">
      <style jsx global>{`
        .slider-container .slick-slide {
          padding: 0 6px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          position: relative;
        }
        .slider-container .slick-list {
          margin: 0 -3px;
        }
        .slider-container .slick-slide:not(.slick-center) {
          opacity: 0.6;
          transform: scale(0.96);
          z-index: 1;
        }
        .slider-container .slick-slide.slick-center {
          opacity: 1;
          transform: scale(1.1);
          z-index: 10;
          position: relative;
        }
        .slider-container .slick-prev,
        .slider-container .slick-next {
          z-index: 20;
          width: 24px;
          height: 24px;
        }
        .slider-container .slick-prev:before,
        .slider-container .slick-next:before {
          color: #b8860b;
          font-size: 24px;
          opacity: 1;
        }
        .slider-container .slick-prev:hover:before,
        .slider-container .slick-next:hover:before {
          color: #8b6914;
          opacity: 1;
        }
        .slider-container .slick-prev {
          left: -35px;
        }
        .slider-container .slick-next {
          right: -35px;
        }
      `}</style>
      <Slider {...settings}>
        <div>{slide("/home/1.png", "Title 1")}</div>
        <div>{slide("/home/2.png", "Title 2")}</div>
        <div>{slide("/home/3.png", "Title 3")}</div>
        <div>{slide("/home/4.png", "Title 4")}</div>
      </Slider>
    </div>
  );
}

export default SliderHome;
