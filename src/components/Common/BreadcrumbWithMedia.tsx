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
      className={`bg-blue-dark min-h-[400px] ${className} pt-4 sm:pt-[155px] lg:pt-[95px] xl:pt-[190px]`}
    >
      <div className="max-w-[1170px]  mx-auto px-4  py-12">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-white">
            <Link href="/" className="hover:text-blue-300 transition-colors">
              Anasayfa
            </Link>
            <span className="text-blue-300">&gt;</span>
            {pages.map((page, index) => (
              <React.Fragment key={index}>
                <span className="text-white capitalize">{page}</span>
                {index < pages.length - 1 && (
                  <span className="text-blue-300">&gt;</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content - Text */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {categoryExtension.title}
            </h1>
            {categoryExtension.subtitle && (
              <p className="text-xl text-white/90 leading-relaxed">
                {categoryExtension.subtitle}
              </p>
            )}

            {categoryExtension.description && (
              <p className="text-md text-white/90 leading-relaxed">
                {categoryExtension.description}
              </p>
            )}
          </div>

          {/* Right Content - Media */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full h-full">
              {mediaElement ? (
                mediaElement
              ) : (
                <>
                  {categoryExtension.mediaUrl && (
                    <img
                      src={categoryExtension.mediaUrl}
                      alt={categoryExtension.title}
                      className="w-auto h-full object-cover rounded-lg"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbWithMedia;
