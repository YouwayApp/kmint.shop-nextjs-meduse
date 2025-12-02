// Strapi Base Types
export interface StrapiMedia {
  id: number
  attributes: {
    name: string
    alternativeText?: string
    caption?: string
    width?: number
    height?: number
    formats?: unknown
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl?: string
    provider: string
    provider_metadata?: unknown
    createdAt: string
    updatedAt: string
  }
}

// Component Types
export interface ContentSection {
  id: number
  Title: string
  Text: string
  Image: {
    data: StrapiMedia
  }
}

export interface Tile {
  id: number
  Title: string
  Description: string
  Icon: {
    data: StrapiMedia
  }
}

export interface WhyUs {
  id: number
  Title: string
  Tile: Tile[]
}

export interface NumericalContent {
  id: number
  Number: string
  Label: string
  Description: string
}

export interface FaqQuestion {
  id: number
  Question: string
  Answer: string
}

export interface Faq {
  id: number
  Title: string
  Question: FaqQuestion[]
  Bookmark: string
}

export interface SocialMedia {
  id: number
  Platform: string
  URL: string
  Icon: {
    data: StrapiMedia
  }
}

export interface ListMedia {
  id: number
  Title: string
  Description: string
  Media: {
    data: StrapiMedia
  }
}

// Main Content Types
export interface AboutUs {
  id: number
  attributes: {
    Banner: {
      data: StrapiMedia[]
    }
    OurStory: ContentSection
    WhyUs: WhyUs
    OurCraftsmanship: ContentSection
    Numbers: NumericalContent[]
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface BlogPostCategory {
  id: number
  attributes: {
    Title: string
    Slug: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface Blog {
  id: number
  attributes: {
    Title: string
    Slug: string
    Content: string
    FeaturedImage: {
      data: StrapiMedia
    }
    Categories: {
      data: BlogPostCategory[]
    }
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface CategoryPage {
  id: number
  attributes: {
    title: string
    content: string
    Slug: string
    vedio?: {
      data: StrapiMedia
    }
    image?: {
      data: StrapiMedia
    }
    secondryDescription?: string
    description: string
    listMedia: ListMedia[]
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface FaqData {
  id: number
  attributes: {
    FAQSection: Faq[]
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface Page {
  id: number
  attributes: {
    Title: string
    description: string
    content: string
    image?: {
      data: StrapiMedia
    }
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface PrivacyPolicy {
  id: number
  attributes: {
    PageContent: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface SiteSetting {
  id: number
  attributes: {
    siteName: string
    siteDecription: string
    siteIcon?: {
      data: StrapiMedia
    }
    supportEmail: string
    supportPhone: string
    address?: string
    vergiNo?: string
    sicilNo?: string
    socailMedia: SocialMedia[]
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface TermsAndCondition {
  id: number
  attributes: {
    PageContent: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

// API Response Types
export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiCollectionResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}
