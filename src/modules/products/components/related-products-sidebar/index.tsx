import { listProducts } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { HttpTypes } from "@medusajs/types";
import Thumbnail from "../thumbnail";
import { convertToLocale } from "@/lib/util/money";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct;
  countryCode: string;
};

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode);

  if (!region) {
    return null;
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: 6,
  };
  if (region?.id) {
    queryParams.region_id = region.id;
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id];
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[];
  }
  queryParams.is_giftcard = false;

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    console.log(response.products);
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    );
  });

  if (!products.length) {
    return null;
  }
  const filteredProducts = products.filter(
    (product) => product.variants?.[0]?.calculated_price
  );

  return (
    <div className="product-page-constraint">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
        {filteredProducts.map((product) => (
          <LocalizedClientLink
            key={product.id}
            href={`/products/${product.handle}`}
            className=""
          >
            <div className="flex space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-3 rounded-lg hover:shadow-md transition-shadow">
              <Thumbnail
                thumbnail={product.thumbnail}
                images={product.images}
                size="small"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-dark truncate">
                  {product.title}
                </p>
                <p className="text-xs text-dark-4">{product.weight} g</p>
                <p className="text-xs sm:text-sm font-semibold text-blue">
                  {product.variants[0].calculated_price &&
                    convertToLocale({
                      amount:
                        product.variants[0].calculated_price?.calculated_amount,
                      currency_code:
                        product.variants[0].calculated_price?.currency_code,
                    })}{" "}
                </p>
              </div>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  );
}
