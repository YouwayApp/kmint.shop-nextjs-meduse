import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryByHandle,
  getCategoryExtension,
  listCategories,
} from "@lib/data/categories";
import { listRegions } from "@lib/data/regions";
import { StoreRegion } from "@medusajs/types";
import CategoryTemplate from "@/components/Categories/CategoryTemplate";
import { SortOptions } from "@/components/Store/RefinementList";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Direct API call for server component

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>;
  searchParams: Promise<{
    sortBy?: SortOptions;
    page?: string;
    q?: string;
  }>;
};

export async function generateStaticParams() {
  try {
    const product_categories = await listCategories();

    if (!product_categories || product_categories.length === 0) {
      console.warn("No categories found, returning empty static params");
      return [];
    }

    const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    );

    if (!countryCodes || countryCodes.length === 0) {
      console.warn("No country codes found, returning empty static params");
      return [];
    }

    const categoryHandles = product_categories.map(
      (category: any) => category.handle
    );

    const staticParams = countryCodes
      ?.map((countryCode: string | undefined) =>
        categoryHandles.map((handle: any) => ({
          countryCode,
          category: [handle],
        }))
      )
      .flat();

    console.log(
      `Generated ${staticParams?.length || 0} static params for category pages`
    );
    return staticParams || [];
  } catch (error) {
    console.error("Failed to generate static params for categories:", error);
    return [];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const productCategory = await getCategoryByHandle(params.category);

    if (!productCategory) {
      return {
        title: "Kategori Bulunamadı ",
        description: "Kategori bulunamadı",
      };
    }

    const title = productCategory.name;
    const description = productCategory.description ?? `${title} kategorisi.`;

    return {
      title: `${title} `,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for category:", error);
    return {
      title: "Kategori Bulunamadı | NextCommerce",
      description: "Kategori bulunamadı",
    };
  }
}

export default async function CategoryPage(props: Props) {
  try {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const { sortBy, page, q } = searchParams;

    const productCategory = await getCategoryByHandle(params.category);

    if (!productCategory) {
      notFound();
    }

    const categoryExtension = await getCategoryExtension(productCategory.id);

    return (
      <CategoryTemplate
        category={productCategory}
        categoryExtension={categoryExtension}
        sortBy={sortBy}
        page={page}
        q={q}
        countryCode={params.countryCode}
      />
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    notFound();
  }
}
