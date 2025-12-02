export type Category = {
  title: string
  id: number
  img: string
}

export interface CategoryExtension {
  id: string
  categoryId: string
  title?: string | null
  subtitle?: string | null
  description?: string | null
  content?: string | null
  mediaUrl?: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface CategoryWithExtension extends Category {
  extension?: CategoryExtension
}
