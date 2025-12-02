import React, { Suspense } from "react";

import ImageGallery from "@modules/products/components/image-gallery";
import ProductActionsCustom from "@modules/products/components/product-actions-custom";
import ProductAbout from "@modules/products/components/product-about";
import RelatedProductsSidebar from "@modules/products/components/related-products-sidebar";
import ProductInfo from "@modules/products/templates/product-info";
import { notFound } from "next/navigation";
import { HttpTypes } from "@medusajs/types";
import Breadcrumb from "@/components/Common/Breadcrumb";
import FAQContent from "@/modules/faq/components/faq-content";

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  countryCode: string;
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound();
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <section>
        <Breadcrumb title={product.title} pages={[product.title]} />
      </section>
      <section className="overflow-hidden relative pt-4 sm:pt-6 lg:pt-8 xl:pt-12 bg-[#f3f4f6]">
        <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
          <div className="pb-8 sm:pb-12 lg:pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
              {/* Product Images - Left Column */}
              <div className="md:col-span-1 lg:col-span-5">
                <div className="relative">
                  <ImageGallery images={product?.images || []} />

                  {/* Product Specifications Overlays */}
                  <div className="absolute left-2 sm:left-4 top-2 sm:top-4 space-y-2 sm:space-y-3">
                    {product.weight && (
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue/10 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 text-blue"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-dark-4">Ağırlık</p>
                            <p className="text-xs sm:text-sm font-semibold text-dark">
                              {product.weight} g
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info & Actions - Center Column */}
              <div className="md:col-span-1 lg:col-span-4">
                <div className="lg:sticky lg:top-8">
                  <ProductInfo product={product} />

                  {/* Product Actions - Custom UI with Medusa Functionality */}
                  <div className="mt-4 sm:mt-6">
                    <ProductActionsCustom product={product} region={region} />
                  </div>

                  {/* About Product */}
                  <ProductAbout product={product} />
                </div>
              </div>

              {/* Similar Products - Right Column (Hidden on mobile/tablet, shown on desktop) */}
              <div className="hidden lg:block lg:col-span-3">
                <div className="sticky top-8">
                  <h3 className="text-lg font-semibold text-dark mb-4">
                    Benzer Ürünler
                  </h3>
                  <RelatedProductsSidebar
                    product={product}
                    countryCode={countryCode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products for Mobile/Tablet */}
        <div className="lg:hidden bg-white">
          <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 py-8 sm:py-12">
            <h3 className="text-lg sm:text-xl font-semibold text-dark mb-4 sm:mb-6">
              Benzer Ürünler
            </h3>
            <RelatedProductsSidebar
              product={product}
              countryCode={countryCode}
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-1">
          <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 py-12 sm:py-16">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-4">
                Sıkça Sorulan Sorular
              </h1>
              <p className="text-base sm:text-lg text-dark-4 max-w-2xl mx-auto">
                Ürünlerimiz, kargo, iade ve daha fazlası hakkında yaygın
                soruların yanıtlarını bulun.
              </p>
            </div>

            {/* FAQ Content */}
            <FAQContent />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductTemplate;
