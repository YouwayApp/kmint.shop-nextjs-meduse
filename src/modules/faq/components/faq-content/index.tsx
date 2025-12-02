import React from "react";
import { fetchMedusaApi } from "@/lib/fetch/fetch-api";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQGroup {
  id: string;
  title: string;
  items: FAQItem[];
}

const FAQContent = async () => {
  // Fetch FAQ data from backend
  const faqResponse = await fetchMedusaApi("/faq");

  // Process FAQ data from API or use fallback
  let faqData: FAQItem[] = [];

  if (faqResponse?.success && faqResponse?.data) {
    // Flatten grouped FAQ data into a single array
    faqData = faqResponse.data.flatMap((group: FAQGroup) =>
      group.items.map((item) => ({
        ...item,
        id: `${group.id}-${item.id}`,
      }))
    );
  }

  // If no data from API, show empty state
  if (faqData.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-dark mb-2">
          SSS öğeleri mevcut değil
        </h3>
        <p className="text-dark-4">
          Lütfen daha sonra tekrar kontrol edin veya destek ekibimizle iletişime
          geçin.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg shadow-sm border border-gray-3 overflow-hidden"
          >
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-1 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-dark pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-dark-4 group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </summary>
              <div className="px-6 pb-6">
                <div className="pt-2 border-t border-gray-3">
                  <p className="text-dark-4 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQContent;
