"use client";

import repeat from "@lib/util/repeat";
import { HttpTypes } from "@medusajs/types";
import { Table, clx } from "@medusajs/ui";

import Item from "@modules/cart/components/item";
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item";

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart;
};

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items;
  const hasOverflow = items && items.length > 4;

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <div className="block lg:hidden">
        {/* Mobile Layout */}
        <div className="space-y-3">
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1;
                })
                .map((item) => {
                  return (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                      <Item
                        item={item}
                        type="full"
                        currencyCode={cart.currency_code}
                      />
                    </div>
                  );
                })
            : repeat(5).map((i) => {
                return (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <SkeletonLineItem />
                  </div>
                );
              })}
        </div>
      </div>

      <div className="hidden lg:block">
        {/* Desktop Layout */}
        <Table>
          <Table.Body data-testid="items-table">
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1;
                  })
                  .map((item) => {
                    return (
                      <Item
                        key={item.id}
                        item={item}
                        type="preview"
                        currencyCode={cart.currency_code}
                      />
                    );
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />;
                })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ItemsPreviewTemplate;
