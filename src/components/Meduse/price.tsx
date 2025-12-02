import { VariantPrice } from "@/types/global";
import { clsx, type ClassValue } from "clsx";

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null;
  }

  return (
    <>
      {price.price_type === "sale" && (
        <span
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={clsx("text-ui-fg-muted", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </>
  );
}
