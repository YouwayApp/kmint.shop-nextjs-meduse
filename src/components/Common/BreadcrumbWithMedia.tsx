import { CategoryExtension } from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BreadcrumbWithMediaProps {
  categoryExtension: CategoryExtension;
  pages: string[];
  mediaElement?: React.ReactNode;
  className?: string;
  mediaUrl?: string;
}

const BreadcrumbWithMedia: React.FC<BreadcrumbWithMediaProps> = ({
  categoryExtension,
  pages,
  mediaElement,
  className = "",
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-[#8B6914] via-[#B8860B] to-[#D4AF37] min-h-[500px] ${className} relative overflow-hidden pt-4 sm:pt-[155px] lg:pt-[95px] xl:pt-[190px]`}
    >
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-12 sm:py-16 lg:py-20 relative z-10">
        {/* Breadcrumbs */}
        <div className="mb-8 sm:mb-12">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              Anasayfa
            </Link>
            <svg
              className="w-4 h-4 text-white/60"
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
            {pages.map((page, index) => (
              <React.Fragment key={index}>
                <span className="text-white font-medium capitalize">
                  {page}
                </span>
                {index < pages.length - 1 && (
                  <svg
                    className="w-4 h-4 text-white/60"
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
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content - Text */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                {categoryExtension.title}
              </h1>

              {categoryExtension.subtitle && (
                <div className="inline-block">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm sm:text-base font-semibold border border-white/30">
                    {categoryExtension.subtitle}
                  </span>
                </div>
              )}
            </div>

            {categoryExtension.description && (
              <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed max-w-2xl">
                {categoryExtension.description}
              </p>
            )}
          </div>

          {/* Right Content - Media */}
          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                {mediaElement ? (
                  <div className="bg-white/10 backdrop-blur-sm p-4">
                    {mediaElement}
                  </div>
                ) : (
                  <>
                    {categoryExtension.mediaUrl && (
                      <img
                        src={categoryExtension.mediaUrl}
                        alt={categoryExtension.title}
                        className="w-full h-auto object-cover"
                      />
                    )}
                  </>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbWithMedia;
