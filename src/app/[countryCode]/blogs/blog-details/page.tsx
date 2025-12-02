import BlogDetails from "@/components/BlogDetails";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog Detayları Sayfası | Kmint Shop online E-ticaret şablonu",
  description: "Kmint Shopiçin Blog Detayları Sayfasıdır",
  // other metadata
};

const BlogDetailsPage = () => {
  return (
    <main>
      <BlogDetails />
    </main>
  );
};

export default BlogDetailsPage;
