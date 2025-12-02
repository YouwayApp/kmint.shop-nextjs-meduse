"use client";
import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleGridItem from "@/components/Shop/SingleGridItem";
import Pagination from "@/components/Common/Pagination";
import { Button, Select } from "@/components/UI";
import { listProducts } from "@lib/data/products";
import { SortOptions } from "@/components/Store/RefinementList";
import Image from "next/image";
import { strapi } from "@strapi/client";
import { CategoryPage } from "@/types/strapi";
import BreadcrumbWithMedia from "@/components/Common/BreadcrumbWithMedia";
import { CategoryExtension } from "@/types/category";

interface CategoryTemplateProps {
  category: HttpTypes.StoreProductCategory;
  sortBy?: SortOptions;
  page?: string;
  countryCode: string;
  categoryExtension: CategoryExtension;
  q?: string;
}

export default function CategoryTemplate({
  category,
  categoryExtension,
  sortBy,
  page,
  countryCode,
  q,
}: CategoryTemplateProps) {
  const [productStyle] = useState("grid");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const [currentSort, setCurrentSort] = useState(sortBy || "created_at");
  const [rootCategory, setRootCategory] =
    useState<HttpTypes.StoreProductCategory | null>(null);

  const pageNumber = page ? parseInt(page) : 1;
  const sort = sortBy || "created_at";

  if (!category || !countryCode) notFound();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { response } = await listProducts({
          pageParam: currentPage,
          queryParams: {
            category_id: category.id,
            limit: 12,
            q: q,
          },
          countryCode,
        });

        setProducts(response.products);
        setTotalPages(Math.ceil(response.count / 12));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, currentSort, countryCode, category.id]);

  const parents = [] as HttpTypes.StoreProductCategory[];

  useEffect(() => {
    setRootCategory(category);
    const getParents = (category: HttpTypes.StoreProductCategory) => {
      if (category.parent_category) {
        parents.push(category.parent_category);
        getParents(category.parent_category);
      }

      if (category.parent_category_id === null) {
        setRootCategory(category);
      }
    };

    getParents(category);
  }, [category]);

  return (
    <>
      <BreadcrumbWithMedia
        categoryExtension={categoryExtension}
        pages={["Kategoriler", category.name]}
      />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-8 xl:pt-12 bg-[#f3f4f6]">
        <div className="max-w-[1170px]  w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* Content Start */}
            <div className="w-full">
              {/* Category Header */}
              <div className="mb-8">
                <div className="flex flex-row mb-4 text-2xl-semi gap-4">
                  {parents &&
                    parents.map((parent) => (
                      <span key={parent.id} className="text-gray-600">
                        <LocalizedClientLink
                          className="mr-4 hover:text-blue-600 transition-colors"
                          href={`/categories/${parent.handle}`}
                        >
                          {parent.name}
                        </LocalizedClientLink>
                        /
                      </span>
                    ))}
                </div>

                {/* Sub Categories */}
                {category.category_children && (
                  <div className="mb-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <li>
                        <LocalizedClientLink
                          href={`/categories/${rootCategory?.handle}`}
                          className="block p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-dark hover:border-blue-300"
                        >
                          <h4 className="font-medium text-blue-dark hover:text-blue-600 transition-colors">
                            Tümü
                          </h4>
                        </LocalizedClientLink>
                      </li>

                      {category.category_children?.map((c) => (
                        <li key={c.id}>
                          <LocalizedClientLink
                            href={`/categories/${c.handle}`}
                            className="block p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-dark hover:border-blue-300"
                          >
                            <h4 className="font-medium text-blue-dark hover:text-blue-600 transition-colors">
                              {c.name}
                            </h4>
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Products Grid Tab Content Start */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-7.5 gap-y-6 sm:gap-y-9">
                  {products.map((product) => (
                    <SingleGridItem
                      key={product.id}
                      item={product}
                      countryCode={countryCode}
                    />
                  ))}
                </div>
              )}
              {/* Products Grid Tab Content End */}

              {/* Products Pagination Start */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-15">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    nextPage={currentPage < totalPages ? currentPage + 1 : null}
                    prevPage={currentPage > 1 ? currentPage - 1 : null}
                  />
                </div>
              )}
              {/* Products Pagination End */}
            </div>
            {/* Content End */}
          </div>

          <div className="w-full mt-18">
            <p
              className="text-gray-5 text-sm"
              dangerouslySetInnerHTML={{ __html: categoryExtension.content }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
