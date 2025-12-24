import React from "react";

const featureData = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14"
        />
      </svg>
    ),
    title: "Hızlı Teslimat",
    description: "Siparişleriniz aynı gün kargoya verilir",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Güvenli Ödeme",
    description: "256-bit SSL şifreleme ile korunuyorsunuz",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    title: "Kolay İade",
    description: "14 gün içinde ücretsiz iade garantisi",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
        />
      </svg>
    ),
    title: "7/24 Destek",
    description: "Her zaman yanınızdayız",
  },
];

const HeroFeature = () => {
  return (
    <section className="bg-gradient-to-r from-[#8B6914] to-[#B8860B] relative">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-8 sm:py-12">
          {featureData.map((item, key) => (
            <div
              key={key}
              className="flex flex-col items-center text-center space-y-3"
            >
              {/* Icon */}
              <div className="text-white flex items-center justify-center">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-base sm:text-lg text-white">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-[200px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Border Line */}
        <div className="h-px bg-white/20"></div>
      </div>
    </section>
  );
};

export default HeroFeature;
