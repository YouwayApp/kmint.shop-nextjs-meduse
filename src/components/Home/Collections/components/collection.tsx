"use client";

import Link from "next/link";
import shopData from "@/components/Shop/shopData";
import ProductItem from "@/components/Common/ProductItem";
import { HttpTypes } from "@medusajs/types";
import { listProducts } from "@/lib/data/products";
import { useEffect, useState } from "react";
import SingleGridItem from "@/components/Shop/SingleGridItem";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";

const Collection = ({
  collection,
  region,
  countryCode,
}: {
  collection: HttpTypes.StoreCollection;
  region: HttpTypes.StoreRegion;
  countryCode: string;
}) => {
  const [collectionProducts, setCollectionProducts] = useState<
    HttpTypes.StoreProduct[]
  >([]);
  useEffect(() => {
    const getProducts = async () => {
      const {
        response: { products: productsData },
      } = await listProducts({
        regionId: region.id,
        queryParams: {
          collection_id: collection.id,
          fields: "*variants.calculated_price",
          limit: 8,
        },
      });
      setCollectionProducts(productsData);
    };
    getProducts();
  }, [region.id, collection.id]);

  return (
    <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
      {/* <!-- section title --> */}
      <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-7 sm:h-7"
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
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-xs sm:text-sm text-dark-4">
                <span className="hidden sm:inline">
                  Özenle seçilmiş premium altın ve gümüş koleksiyonumuzu
                  keşfedin
                </span>
                <span className="sm:hidden">Premium koleksiyon</span>
              </span>
              <h2 className="font-semibold text-lg sm:text-xl xl:text-heading-5 text-dark mt-0.5">
                Popüler Ürünler
              </h2>
            </div>
          </div>
        </div>

        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="inline-flex font-medium text-xs sm:text-custom-sm py-2 sm:py-2.5 px-4 sm:px-7 border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent flex-shrink-0"
        >
          Koleksiyonu İncele
        </LocalizedClientLink>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-7.5 gap-y-6 sm:gap-y-9">
        {/* <!-- list items --> */}
        {collectionProducts.map((item, key) => (
          <SingleGridItem key={item.id} item={item} countryCode={countryCode} />
        ))}
      </div>
    </div>
  );
};

export default Collection;
