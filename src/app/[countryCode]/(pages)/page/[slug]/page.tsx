import React from "react";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { fetchMedusaApi } from "@/lib/fetch/fetch-api";

interface SitePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
    countryCode: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const response = await fetchMedusaApi(`/site-pages/${slug}`);

    if (response?.success && response?.data) {
      const page: SitePage = response.data;
      return {
        title: page.meta_title || page.title,
        description: page.meta_description || `Read more about ${page.title}`,
      };
    }
  } catch (error) {
    console.error("Error fetching page metadata:", error);
  }

  return {
    title: "Sayfa Bulunamadı",
    description: "İstenen sayfa bulunamadı.",
  };
}

const DynamicPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  // Fetch page data from backend
  const response = await fetchMedusaApi(`/site-pages/${slug}`);

  if (!response?.success || !response?.data) {
    notFound();
  }

  const page: SitePage = response.data;

  return (
    <>
      {/* Breadcrumb Section */}
      <section>
        <Breadcrumb title={page.title} pages={[page.title]} />
      </section>

      {/* Page Content */}
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-8 xl:pt-12 bg-[#f3f4f6]">
        <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="py-8">
            {/* Page Content */}
            <div className="w-full mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-3 p-8">
                <div
                  className="prose prose-lg max-w-none text-dark-4 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DynamicPage;
