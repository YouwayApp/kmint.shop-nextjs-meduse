import { Metadata } from "next";
import { notFound } from "next/navigation";
import { listProducts } from "@lib/data/products";
import { getRegion, listRegions } from "@lib/data/regions";
import ProductTemplate from "@modules/products/templates";

// Force dynamic rendering
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ countryCode: string; handle: string }>;
};

export async function generateStaticParams() {
  // For build-time static generation, we'll return empty array
  // This will make the pages dynamic and render on-demand
  // This prevents build failures when the backend is not available
  console.log(
    "Skipping static generation for product pages - using dynamic rendering"
  );
  return [];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const { handle } = params;
    const region = await getRegion(params.countryCode);

    if (!region) {
      notFound();
    }

    const product = await listProducts({
      countryCode: params.countryCode,
      queryParams: { handle },
    }).then(({ response }) => response.products[0]);

    if (!product) {
      notFound();
    }

    return {
      title: `${product.title}`,
      description: `${product.title}`,
      openGraph: {
        title: `${product.title}`,
        description: `${product.title}`,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for product:", error);
    return {
      title: "Ürün Bulunamadı ",
      description: "Ürün bulunamadı",
    };
  }
}

export default async function ProductPage(props: Props) {
  try {
    const params = await props.params;
    const region = await getRegion(params.countryCode);

    if (!region) {
      notFound();
    }

    const pricedProduct = await listProducts({
      countryCode: params.countryCode,
      queryParams: { handle: params.handle },
      forceCache: "no-cache",
    }).then(({ response }) => response.products[0]);

    if (!pricedProduct) {
      notFound();
    }

    return (
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
      />
    );
  } catch (error) {
    console.error(
      `Failed to load product page: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    );
    notFound();
  }
}
