import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/data/collections";
import { getRegion } from "@/lib/data/regions";
import { listProducts } from "@/lib/data/products";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleGridItem from "@/components/Shop/SingleGridItem";
import { HttpTypes } from "@medusajs/types";

// Force dynamic rendering
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ countryCode: string; handle: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const collection = await getCollectionByHandle(params.handle);

    if (!collection) {
      return {
        title: "Koleksiyon Bulunamadı | Medusa Mağaza",
        description: "İstenen koleksiyon bulunamadı",
      };
    }

    return {
      title: `${collection.title} | Medusa Mağaza`,
      description:
        collection.metadata?.description ||
        `${collection.title} koleksiyonundaki ürünleri keşfedin`,
      openGraph: {
        title: `${collection.title} | Medusa Mağaza`,
        description:
          collection.metadata?.description ||
          `${collection.title} koleksiyonundaki ürünleri keşfedin`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for collection:", error);
    return {
      title: "Koleksiyon Bulunamadı | Medusa Mağaza",
      description: "İstenen koleksiyon bulunamadı",
    };
  }
}

export default async function CollectionPage(props: Props) {
  try {
    const params = await props.params;
    const { countryCode, handle } = params;

    // Get region for the country
    const region = await getRegion(countryCode);
    if (!region) {
      notFound();
    }

    // Get collection by handle
    const collection = await getCollectionByHandle(handle);
    if (!collection) {
      notFound();
    }

    // Get products in this collection
    const {
      response: { products },
    } = await listProducts({
      countryCode,
      queryParams: {
        collection_id: collection.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        limit: "50",
      },
    });

    return (
      <>
        {/* Breadcrumb Section */}
        <section>
          <Breadcrumb
            title={collection.title}
            pages={["Koleksiyonlar", collection.title]}
          />
        </section>

        {/* Collection Content */}
        <section className="overflow-hidden relative pb-20 pt-5 lg:pt-8 xl:pt-12 bg-[#f3f4f6]">
          <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="py-8">
              {/* Collection Header */}
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.11826 15.4622C4.11794 16.6668 5.97853 16.6668 9.69971 16.6668H10.3007C14.0219 16.6668 15.8825 16.6668 16.8821 15.4622M3.11826 15.4622C2.11857 14.2577 2.46146 12.429 3.14723 8.77153C3.63491 6.17055 3.87875 4.87006 4.8045 4.10175M3.11826 15.4622C3.11826 15.4622 3.11826 15.4622 3.11826 15.4622ZM16.8821 15.4622C17.8818 14.2577 17.5389 12.429 16.8532 8.77153C16.3655 6.17055 16.1216 4.87006 15.1959 4.10175M16.8821 15.4622C16.8821 15.4622 16.8821 15.4622 16.8821 15.4622ZM15.1959 4.10175C14.2701 3.33345 12.947 3.33345 10.3007 3.33345H9.69971C7.0534 3.33345 5.73025 3.33345 4.8045 4.10175M15.1959 4.10175C15.1959 4.10175 15.1959 4.10175 15.1959 4.10175ZM4.8045 4.10175C4.8045 4.10175 4.8045 4.10175 4.8045 4.10175Z"
                        stroke="#b8860b"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7.64258 6.66678C7.98578 7.63778 8.91181 8.33345 10.0003 8.33345C11.0888 8.33345 12.0149 7.63778 12.3581 6.66678"
                        stroke="#b8860b"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Koleksiyon
                  </span>
                  <h1 className="font-semibold text-xl xl:text-heading-5 text-dark">
                    {collection.title}
                  </h1>
                  {collection.metadata?.description && (
                    <p className="text-gray-600 mt-2 max-w-2xl">
                      {collection.metadata.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
                  {products.map((product) => (
                    <SingleGridItem
                      key={product.id}
                      item={product}
                      countryCode={countryCode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Ürün bulunamadı
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Bu koleksiyonda henüz ürün bulunmuyor.
                    </p>
                  </div>
                </div>
              )}

              {/* Collection Stats */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  {products.length} ürün gösteriliyor
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.error("Error loading collection page:", error);
    notFound();
  }
}
