"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import LocalizedClientLink from "@/components/Meduse/localized-client-link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category?: string;
  publishedAt: string;
  readTime?: number;
}

// Mock data - API'den gelecek verilerle değiştirilebilir
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Altın Yatırımında Dikkat Edilmesi Gerekenler",
    slug: "altin-yatiriminda-dikkat-edilmesi-gerekenler",
    excerpt:
      "Altın yatırımı yaparken bilmeniz gereken önemli noktalar ve stratejiler. Doğru altın seçimi ve yatırım zamanlaması hakkında detaylı bilgiler.",
    coverImage: "/blog/altin-yatirim.jpg",
    category: "Yatırım",
    publishedAt: "2024-01-15",
    readTime: 5,
  },
  {
    id: "2",
    title: "Gümüş Takıların Bakımı ve Temizliği",
    slug: "gumus-takilarin-bakimi-ve-temizligi",
    excerpt:
      "Gümüş takılarınızın parlaklığını korumak için pratik bakım ipuçları. Evde kolayca uygulayabileceğiniz temizlik yöntemleri.",
    coverImage: "/blog/gumus-bakim.jpg",
    category: "Bakım",
    publishedAt: "2024-01-10",
    readTime: 3,
  },
  {
    id: "3",
    title: "Gram Altın vs Külçe Altın: Hangisini Seçmelisiniz?",
    slug: "gram-altin-vs-kulce-altin",
    excerpt:
      "Altın yatırımında gram altın ve külçe altın arasındaki farklar. Hangi seçeneğin size daha uygun olduğunu öğrenin.",
    coverImage: "/blog/gram-kulce.jpg",
    category: "Rehber",
    publishedAt: "2024-01-05",
    readTime: 7,
  },
];

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API'den blog yazılarını çek
    // Şimdilik mock data kullanıyoruz
    const fetchBlogPosts = async () => {
      try {
        // TODO: API endpoint'i eklendiğinde buraya entegre edilecek
        // const response = await fetch('/api/blog/posts?limit=3');
        // const data = await response.json();
        // setBlogPosts(data.posts);

        // Mock data
        setBlogPosts(mockBlogPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts(mockBlogPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-custom-xs font-semibold text-blue uppercase tracking-wider mb-3">
            Blog & Rehber
          </span>
          <h2 className="text-3xl sm:text-4xl xl:text-heading-3 font-bold text-dark mb-4">
            Altın ve Gümüş Hakkında
          </h2>
          <p className="text-custom-sm text-dark-4 max-w-2xl mx-auto">
            Yatırım ipuçları, bakım rehberleri ve altın dünyasından son haberler
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-2">
                <LocalizedClientLink href={`/blog/${post.slug}`}>
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue/10 to-blue/5 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-blue/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                  )}
                </LocalizedClientLink>

                {/* Category Badge */}
                {post.category && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue text-custom-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Date and Read Time */}
                <div className="flex items-center gap-3 text-custom-xs text-dark-4 mb-3">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(post.publishedAt)}
                  </span>
                  {post.readTime && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {post.readTime} dk okuma
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg sm:text-xl text-dark mb-3 line-clamp-2 group-hover:text-blue transition-colors">
                  <LocalizedClientLink href={`/blog/${post.slug}`}>
                    {post.title}
                  </LocalizedClientLink>
                </h3>

                {/* Excerpt */}
                <p className="text-custom-sm text-dark-4 line-clamp-3 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <LocalizedClientLink
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blue font-semibold text-custom-sm hover:gap-3 transition-all group/link"
                >
                  <span>Devamını Oku</span>
                  <svg
                    className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </LocalizedClientLink>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <LocalizedClientLink
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue hover:bg-blue-dark text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Tüm Yazıları Görüntüle</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  );
};

export default Blog;
