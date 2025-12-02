"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import shopData from "@/components/Shop/shopData";
import { useSiteConfig } from "@/providers/SiteProvider";
import { getRegion } from "@/lib/data/regions";
import { HttpTypes } from "@medusajs/types";
import { listCollections } from "@/lib/data/collections";
import Collection from "./components/collection";
import { useParams } from "next/navigation";

const NewArrival = () => {
  const params = useParams();
  const { countryCode } = params;

  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null);
  const [collections, setCollections] = useState<HttpTypes.StoreCollection[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryCode) return;

    setLoading(true);
    console.log("Fetching collections for country:", countryCode);

    const getCollections = async () => {
      try {
        console.log("Starting to fetch region...");
        const regionData = await getRegion(countryCode as string);
        setRegion(regionData);

        const { collections: collectionsData } = await listCollections({
          fields: "id, handle, title, slug",
          limit: "8",
        });
        setCollections(collectionsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    getCollections();
  }, [countryCode]);

  return (
    <section className="overflow-hidden pt-15">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        collections.map((collection) => (
          <Collection
            key={collection.id}
            collection={collection}
            region={region}
            countryCode={countryCode as string}
          />
        ))
      )}
    </section>
  );
};

export default NewArrival;
