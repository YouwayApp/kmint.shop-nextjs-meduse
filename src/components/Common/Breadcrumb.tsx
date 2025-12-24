import Link from "next/link";
import React from "react";

const Breadcrumb = ({ title, pages }) => {
  return (
    <div className="overflow-hidden bg-white border-b border-gray-3 pt-0 sm:pt-[155px] lg:pt-[95px] xl:pt-[200px]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-6 sm:py-8 xl:py-10">
        <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <h1 className="font-semibold text-dark text-2xl sm:text-3xl xl:text-4xl">
            {title}
          </h1>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="text-custom-sm text-dark-4 hover:text-blue transition-colors font-medium"
                >
                  Ana Sayfa
                </Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <React.Fragment key={key}>
                    <li className="flex items-center">
                      <svg
                        className="w-3 h-3 text-gray-4 mx-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </li>
                    <li>
                      <span
                        className={`text-custom-sm capitalize font-medium ${
                          key === pages.length - 1 ? "text-blue" : "text-dark-4"
                        }`}
                      >
                        {page}
                      </span>
                    </li>
                  </React.Fragment>
                ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
