import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import FAQContent from "@/modules/faq/components/faq-content";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | Kmint Shop online",
  description: "Kmint Shop online",
  // other metadata
};

const FAQPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <section>
        <Breadcrumb title={"SSS"} pages={["SSS"]} />
      </section>

      {/* FAQ Section */}
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-8 xl:pt-12 bg-[#f3f4f6]">
        <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                Sıkça Sorulan Sorular
              </h1>
              <p className="text-lg text-dark-4 max-w-2xl mx-auto">
                Ürünlerimiz, kargo, iade ve daha fazlası hakkında yaygın
                soruların yanıtlarını bulun.
              </p>
            </div>

            {/* FAQ Content */}
            <FAQContent />

            {/* Contact Section */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-lg shadow-sm border border-gray-3 p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-dark mb-4">
                  Hala sorularınız var mı?
                </h2>
                <p className="text-dark-4 mb-6">
                  Aradığınızı bulamıyor musunuz? Müşteri hizmetleri ekibimiz
                  size yardımcı olmak için burada.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:support@example.com"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue text-white font-medium rounded-md hover:bg-blue-dark transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    E-posta Desteği
                  </a>
                  <a
                    href="tel:1-800-EXAMPLE"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-3 text-dark font-medium rounded-md hover:bg-gray-1 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Bizi Arayın
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
