"use client";

import { HttpTypes } from "@medusajs/types";
import { Container } from "@medusajs/ui";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[];
};

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex((prev) => prev + 1);
    }
    if (isRightSwipe && selectedImageIndex > 0) {
      setSelectedImageIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && selectedImageIndex > 0) {
        setSelectedImageIndex((prev) => prev - 1);
      }
      if (e.key === "ArrowRight" && selectedImageIndex < images.length - 1) {
        setSelectedImageIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-2 rounded-lg flex items-center justify-center">
        <p className="text-dark-4">No images available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Image Display */}
      <div
        ref={mainImageRef}
        className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gray-2 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images[selectedImageIndex] && (
          <Image
            src={images[selectedImageIndex].url}
            alt={`Product image ${selectedImageIndex + 1}`}
            fill
            className="object-cover select-none"
            priority={selectedImageIndex <= 2}
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 600px"
            draggable={false}
          />
        )}

        {/* Navigation Arrows - Hidden on mobile, shown on desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1
                )
              }
              className="hidden md:flex absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full items-center justify-center shadow-lg transition-all duration-200 z-10"
            >
              <svg
                className="w-5 h-5 text-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0
                )
              }
              className="hidden md:flex absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full items-center justify-center shadow-lg transition-all duration-200 z-10"
            >
              <svg
                className="w-5 h-5 text-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Mobile swipe indicator */}
        {images.length > 1 && (
          <div className="md:hidden absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            Swipe to navigate
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto p-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                selectedImageIndex === index
                  ? "ring-2 ring-blue border-1 border-blue"
                  : "border border-gray-3 hover:border-gray-4"
              }`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 64px, 72px"
                draggable={false}
              />
              {selectedImageIndex === index && (
                <div className="absolute inset-0 bg-blue/10"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Counter & Navigation Dots */}
      {images.length > 1 && (
        <div className="mt-3 flex items-center justify-center space-x-4">
          {/* Navigation Dots - Mobile */}
          <div className="md:hidden flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  selectedImageIndex === index
                    ? "bg-blue w-6"
                    : "bg-gray-3 hover:bg-gray-4"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
