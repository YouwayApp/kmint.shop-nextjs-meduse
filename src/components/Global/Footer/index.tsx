import React from "react";
import Image from "next/image";
import { useCategories, useSiteConfig } from "@/providers/SiteProvider";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";

const Footer = () => {
  const year = new Date().getFullYear();

  const { getConfig } = useSiteConfig();
  const address = getConfig("contact.address");
  const phone = getConfig("contact.phone");
  const email = getConfig("contact.email");
  const facebook = getConfig("social.facebook");
  const instagram = getConfig("social.instagram");
  const twitter = getConfig("social.twitter");
  const youtube = getConfig("social.youtube");
  const linkedin = getConfig("social.linkedin");

  const categories = useCategories();
  const rootCategories = categories.getRootCategories();

  const menuData = [];
  rootCategories.forEach((category) => {
    menuData.push({
      id: category.id,
      title: category.name,
      path: `/categories/${category.handle}`,
    });
  });

  return (
    <footer className="bg-dark text-white">
      {/* Top Strip - Mobil Uygulama ve Sosyal Medya */}
      <div className="border-b border-white/10">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Sol Taraf - Mobil Uygulama İkonları */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 bg-white/10 hover:bg-white/20 transition-colors group"
              >
                <svg
                  className="fill-current text-white"
                  width="28"
                  height="28"
                  viewBox="0 0 34 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29.5529 12.3412C29.3618 12.4871 25.9887 14.3586 25.9887 18.5198C25.9887 23.3331 30.2809 25.0358 30.4093 25.078C30.3896 25.1818 29.7275 27.41 28.1463 29.6804C26.7364 31.6783 25.264 33.6731 23.024 33.6731C20.7841 33.6731 20.2076 32.3918 17.6217 32.3918C15.1018 32.3918 14.2058 33.7152 12.1569 33.7152C10.1079 33.7152 8.6783 31.8664 7.03456 29.5961C5.13062 26.93 3.59229 22.7882 3.59229 18.8572C3.59229 12.552 7.756 9.20804 11.8538 9.20804C14.0312 9.20804 15.8462 10.6157 17.2133 10.6157C18.5144 10.6157 20.5436 9.12373 23.0207 9.12373C23.9595 9.12373 27.3327 9.20804 29.5529 12.3412ZM21.8447 6.45441C22.8692 5.25759 23.5939 3.59697 23.5939 1.93635C23.5939 1.70607 23.5741 1.47254 23.5313 1.28442C21.8645 1.34605 19.8815 2.37745 18.6857 3.74292C17.7469 4.79379 16.8707 6.45441 16.8707 8.13773C16.8707 8.39076 16.9135 8.64369 16.9333 8.72476C17.0387 8.74426 17.21 8.76694 17.3813 8.76694C18.8768 8.76694 20.7577 7.78094 21.8447 6.45441Z"
                    fill=""
                  />
                </svg>
                <div>
                  <span className="block text-custom-xs text-gray-4 group-hover:text-white transition-colors">
                    İndir
                  </span>
                  <p className="font-medium text-white text-custom-sm">
                    App Store
                  </p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 bg-white/10 hover:bg-white/20 transition-colors group"
              >
                <svg
                  className="fill-current text-white"
                  width="28"
                  height="28"
                  viewBox="0 0 34 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.45764 1.03125L19.9718 15.5427L23.7171 11.7973C18.5993 8.69224 11.7448 4.52679 8.66206 2.65395L6.59681 1.40278C6.23175 1.18039 5.84088 1.06062 5.45764 1.03125ZM3.24214 2.76868C3.21276 2.92814 3.1875 3.08837 3.1875 3.26041V31.939C3.1875 32.0593 3.21169 32.1713 3.22848 32.2859L17.9939 17.5205L3.24214 2.76868ZM26.1785 13.2916L21.9496 17.5205L26.1047 21.6756C28.3062 20.3412 29.831 19.4147 30.0003 19.3126C30.7486 18.8552 31.1712 18.1651 31.1586 17.4112C31.1474 16.6713 30.7247 16.0098 30.0057 15.6028C29.8449 15.5104 28.3408 14.6022 26.1785 13.2916ZM19.9718 19.4983L5.50135 33.9688C5.78248 33.9198 6.06327 33.836 6.33182 33.6737C6.70387 33.4471 16.7548 27.3492 23.6433 23.1699L19.9718 19.4983Z"
                    fill=""
                  />
                </svg>
                <div>
                  <span className="block text-custom-xs text-gray-4 group-hover:text-white transition-colors">
                    İndir
                  </span>
                  <p className="font-medium text-white text-custom-sm">
                    Google Play
                  </p>
                </div>
              </a>
            </div>

            {/* Sağ Taraf - Sosyal Medya İkonları */}
            <div className="flex items-center gap-4">
              {facebook && (
                <a
                  href={facebook}
                  aria-label="Facebook"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg
                    className="text-white"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.99984 0.666504C7.48706 0.666504 6.09165 1.04648 4.81361 1.80644C3.53557 2.54019 2.51836 3.5491 1.76197 4.83317C1.03166 6.11724 0.666504 7.51923 0.666504 9.03915C0.666504 10.428 0.966452 11.7252 1.56635 12.9307C2.19233 14.1099 3.04 15.0926 4.10938 15.8788C5.17876 16.6649 6.37855 17.1497 7.70876 17.3332V11.4763H5.59608V9.03915H7.70876V7.19166C7.70876 6.16965 7.98262 5.37038 8.53035 4.79386C9.10417 4.21734 9.8736 3.92908 10.8386 3.92908C11.4646 3.92908 12.0906 3.98149 12.7166 4.08632V6.16965H11.6602C11.1908 6.16965 10.8386 6.30068 10.6039 6.56273C10.3952 6.79858 10.2909 7.09994 10.2909 7.46682V9.03915H12.6383L12.2471 11.4763H10.2909V17.3332C11.6472 17.1235 12.86 16.6256 13.9294 15.8395C14.9988 15.0533 15.8334 14.0706 16.4333 12.8913C17.0332 11.6859 17.3332 10.4018 17.3332 9.03915C17.3332 7.51923 16.955 6.11724 16.1986 4.83317C15.4683 3.5491 14.4641 2.54019 13.1861 1.80644C11.908 1.04648 10.5126 0.666504 8.99984 0.666504Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              )}

              {twitter && (
                <a
                  href={twitter}
                  aria-label="X (Twitter)"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg
                    className="text-white"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              )}

              {instagram && (
                <a
                  href={instagram}
                  aria-label="Instagram"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg
                    className="text-white"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-16 xl:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* İletişim Bölümü */}
          <div className="lg:col-span-1">
            <h3 className="text-custom-lg font-semibold mb-6 text-white">
              İletişim
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.25 8.51464C4.25 4.45264 7.77146 1.25 12 1.25C16.2285 1.25 19.75 4.45264 19.75 8.51464C19.75 12.3258 17.3871 16.8 13.5748 18.4292C12.574 18.8569 11.426 18.8569 10.4252 18.4292C6.61289 16.8 4.25 12.3258 4.25 8.51464ZM12 2.75C8.49655 2.75 5.75 5.38076 5.75 8.51464C5.75 11.843 7.85543 15.6998 11.0147 17.0499C11.639 17.3167 12.361 17.3167 12.9853 17.0499C16.1446 15.6998 18.25 11.843 18.25 8.51464C18.25 5.38076 15.5034 2.75 12 2.75ZM12 7.75C11.3096 7.75 10.75 8.30964 10.75 9C10.75 9.69036 11.3096 10.25 12 10.25C12.6904 10.25 13.25 9.69036 13.25 9C13.25 8.30964 12.6904 7.75 12 7.75ZM9.25 9C9.25 7.48122 10.4812 6.25 12 6.25C13.5188 6.25 14.75 7.48122 14.75 9C14.75 10.5188 13.5188 11.75 12 11.75C10.4812 11.75 9.25 10.5188 9.25 9Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="text-custom-sm text-gray-4 leading-relaxed">
                  {address}
                </span>
              </li>

              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-custom-sm text-gray-4 hover:text-white transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.7177 3.0919C5.94388 1.80096 7.9721 2.04283 8.98569 3.47641L10.2467 5.25989C11.0574 6.40656 10.9889 8.00073 10.0214 9.0194L9.7765 9.27719C9.77582 9.27897 9.7751 9.2809 9.77436 9.28299C9.76142 9.31935 9.7287 9.43513 9.7609 9.65489C9.82765 10.1104 10.1793 11.0361 11.607 12.5392C13.0391 14.0469 13.9078 14.4023 14.3103 14.4677C14.484 14.4959 14.5748 14.4714 14.6038 14.4612L15.0124 14.031C15.8862 13.111 17.2485 12.9298 18.347 13.5621L20.2575 14.6617C21.8904 15.6016 22.2705 17.9008 20.9655 19.2747L19.545 20.7703C19.1016 21.2371 18.497 21.6355 17.75 21.7092C15.9261 21.8893 11.701 21.6548 7.27161 16.9915C3.13844 12.64 2.35326 8.85513 2.25401 7.00591L2.92011 6.97016L2.25401 7.00591C2.20497 6.09224 2.61224 5.30855 3.1481 4.7444L4.7177 3.0919ZM7.7609 4.34237C7.24855 3.61773 6.32812 3.57449 5.80528 4.12493L4.23568 5.77743C3.90429 6.12632 3.73042 6.52621 3.75185 6.92552C3.83289 8.43533 4.48307 11.8776 8.35919 15.9584C12.4234 20.2373 16.1676 20.3581 17.6026 20.2165C17.8864 20.1885 18.1783 20.031 18.4574 19.7373L19.8779 18.2417C20.4907 17.5965 20.3301 16.4342 19.5092 15.9618L17.5987 14.8621C17.086 14.567 16.4854 14.6582 16.1 15.064L15.6445 15.5435L15.1174 15.0428C15.6445 15.5435 15.6438 15.5442 15.6432 15.545L15.6417 15.5464L15.6388 15.5495L15.6324 15.556L15.6181 15.5701C15.6078 15.5801 15.5959 15.591 15.5825 15.6028C15.5556 15.6264 15.5223 15.6533 15.4824 15.6816C15.4022 15.7384 15.2955 15.8009 15.1606 15.8541C14.8846 15.963 14.5201 16.0214 14.0699 15.9483C13.1923 15.8058 12.0422 15.1755 10.5194 13.5722C8.99202 11.9642 8.40746 10.7645 8.27675 9.87234C8.21022 9.41827 8.26346 9.05468 8.36116 8.78011C8.40921 8.64508 8.46594 8.53742 8.51826 8.45566C8.54435 8.41489 8.56922 8.38075 8.5912 8.35298C8.60219 8.33909 8.61246 8.32678 8.62182 8.31603L8.63514 8.30104L8.64125 8.29441L8.64415 8.2913L8.64556 8.2898C8.64625 8.28907 8.64694 8.28835 9.17861 8.79333L8.64695 8.28834L8.93376 7.98637C9.3793 7.51731 9.44403 6.72292 9.02189 6.12586L7.7609 4.34237Z"
                      fill="currentColor"
                    />
                  </svg>
                  {phone}
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-custom-sm text-gray-4 hover:text-white transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.94358 3.25H14.0564C15.8942 3.24998 17.3498 3.24997 18.489 3.40314C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.1071 5.38961 22.4392 6.33856 22.5969 7.51098C22.75 8.65019 22.75 10.1058 22.75 11.9436V12.0564C22.75 13.8942 22.75 15.3498 22.5969 16.489C22.4392 17.6614 22.1071 18.6104 21.3588 19.3588C20.6104 20.1071 19.6614 20.4392 18.489 20.5969C17.3498 20.75 15.8942 20.75 14.0564 20.75H9.94359C8.10583 20.75 6.65019 20.75 5.51098 20.5969C4.33856 20.4392 3.38961 20.1071 2.64124 19.3588C1.89288 18.6104 1.56076 17.6614 1.40314 16.489C1.24997 15.3498 1.24998 13.8942 1.25 12.0564V11.9436C1.24998 10.1058 1.24997 8.65019 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40314C6.65019 3.24997 8.10582 3.24998 9.94358 3.25ZM5.71085 4.88976C4.70476 5.02502 4.12511 5.27869 3.7019 5.7019C3.27869 6.12511 3.02502 6.70476 2.88976 7.71085C2.75159 8.73851 2.75 10.0932 2.75 12C2.75 13.9068 2.75159 15.2615 2.88976 16.2892C3.02502 17.2952 3.27869 17.8749 3.7019 18.2981C4.12511 18.7213 4.70476 18.975 5.71085 19.1102C6.73851 19.2484 8.09318 19.25 10 19.25H14C15.9068 19.25 17.2615 19.2484 18.2892 19.1102C19.2952 18.975 19.8749 18.7213 20.2981 18.2981C20.7213 17.8749 20.975 17.2952 21.1102 16.2892C21.2484 15.2615 21.25 13.9068 21.25 12C21.25 10.0932 21.2484 8.73851 21.1102 7.71085C20.975 6.70476 20.7213 6.12511 20.2981 5.7019C19.8749 5.27869 19.2952 5.02502 18.2892 4.88976C17.2615 4.75159 15.9068 4.75 14 4.75H10C8.09318 4.75 6.73851 4.75159 5.71085 4.88976ZM5.42383 7.51986C5.68901 7.20165 6.16193 7.15866 6.48014 7.42383L8.63903 9.22291C9.57199 10.0004 10.2197 10.5384 10.7666 10.8901C11.2959 11.2306 11.6549 11.3449 12 11.3449C12.3451 11.3449 12.7041 11.2306 13.2334 10.8901C13.7803 10.5384 14.428 10.0004 15.361 9.22291L17.5199 7.42383C17.8381 7.15866 18.311 7.20165 18.5762 7.51986C18.8413 7.83807 18.7983 8.31099 18.4801 8.57617L16.2836 10.4066C15.3973 11.1452 14.6789 11.7439 14.0448 12.1517C13.3843 12.5765 12.7411 12.8449 12 12.8449C11.2589 12.8449 10.6157 12.5765 9.95518 12.1517C9.32112 11.7439 8.60272 11.1452 7.71636 10.4066L5.51986 8.57617C5.20165 8.31099 5.15866 7.83807 5.42383 7.51986Z"
                      fill="currentColor"
                    />
                  </svg>
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Ürünler Bölümü */}
          <div>
            <h3 className="text-custom-lg font-semibold mb-6 text-white">
              Ürünler
            </h3>
            <ul className="space-y-3">
              {menuData.map((menuItem, i) => (
                <li key={i}>
                  <LocalizedClientLink
                    href={menuItem.path}
                    className="text-custom-sm text-gray-4 hover:text-white transition-colors inline-block"
                  >
                    {menuItem.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-custom-lg font-semibold mb-6 text-white">
              Hızlı Bağlantılar
            </h3>
            <ul className="space-y-3">
              <li>
                <LocalizedClientLink
                  href="/page/hakkimizda"
                  className="text-custom-sm text-gray-4 hover:text-white transition-colors inline-block"
                >
                  Hakkımızda
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/contact"
                  className="text-custom-sm text-gray-4 hover:text-white transition-colors inline-block"
                >
                  İletişim
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/faq"
                  className="text-custom-sm text-gray-4 hover:text-white transition-colors inline-block"
                >
                  SSS
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-6">
          {/* Hakkımızda Yazısı */}
          <div className="mb-6 pb-6 border-b border-white/5">
            <p className="text-[10px] leading-relaxed text-gray-5 text-center max-w-4xl mx-auto">
              <span className="font-medium text-gray-4">
                Kmint Shop Hakkında:
              </span>{" "}
              Altın ticareti, binlerce yıllık köklü bir geçmişe sahiptir. Antik
              çağlardan beri değerli bir metal olarak kabul edilen altın,
              medeniyetlerin ekonomik sistemlerinin temelini oluşturmuştur.
              Mısır, Mezopotamya ve Anadolu uygarlıkları altın ticaretinde öncü
              rol oynamışlardır. Orta Çağ'da altın, ticaret yollarının en önemli
              metaı haline gelmiş, Rönesans döneminde ise bankacılık sisteminin
              gelişmesinde kritik bir rol üstlenmiştir. Modern dönemde altın,
              hem yatırım hem de mücevherat sektöründe vazgeçilmez bir değer
              olarak yerini korumaktadır. Kmint Shop olarak, bu köklü geleneği
              dijital çağa taşıyarak, müşterilerimize güvenilir ve kaliteli
              altın ürünleri sunmaktayız.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-custom-sm text-gray-4 text-center sm:text-left">
              &copy; {year}. Kmint Shop Tüm hakları saklıdır.
            </p>

            <div className="flex items-center gap-6">
              <a href="#" aria-label="visa card">
                <Image
                  src="/images/payment/payment-01.svg"
                  alt="visa card"
                  width={50}
                  height={18}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
              </a>

              <a href="#" aria-label="master card">
                <Image
                  src="/images/payment/payment-03.svg"
                  alt="master card"
                  width={24}
                  height={18}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
