'use server'

import { HttpTypes } from '@medusajs/types'
import { cache } from 'react'
import { listCategories } from '@/lib/data/categories'

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes in milliseconds

interface CacheData {
  categories: HttpTypes.StoreProductCategory[]
  timestamp: number
}

// In-memory cache for server-side
let serverCache: CacheData | null = null

// Check if cache is valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION
}

// Load from server cache
const loadFromServerCache = (): HttpTypes.StoreProductCategory[] | null => {
  if (!serverCache) return null

  if (isCacheValid(serverCache.timestamp)) {
    console.log('📦 Loading categories from server cache')
    return serverCache.categories
  } else {
    console.log('⏰ Server cache expired, will fetch fresh data')
    serverCache = null
    return null
  }
}

// Save to server cache
const saveToServerCache = (categories: HttpTypes.StoreProductCategory[]) => {
  serverCache = {
    categories,
    timestamp: Date.now(),
  }
  console.log('💾 Categories saved to server cache')
}

// Cached fetch function using existing listCategories
const fetchCategoriesFromAPI = async (): Promise<
  HttpTypes.StoreProductCategory[]
> => {
  try {
    console.log('🌐 Fetching categories using listCategories...')

    // Use existing listCategories function
    const categories = await listCategories()

    // Save to server cache
    saveToServerCache(categories)

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const getCategories = cache(
  async (): Promise<HttpTypes.StoreProductCategory[]> => {
    try {
      // Try to load from server cache first
      const cachedCategories = loadFromServerCache()
      if (cachedCategories) {
        return cachedCategories
      }

      // Fetch fresh data if no valid cache
      return await fetchCategoriesFromAPI()
    } catch (error) {
      console.error('Error in getCategories:', error)
      throw error
    }
  },
)

// Force refresh function (bypasses cache)
export async function refreshCategories(): Promise<
  HttpTypes.StoreProductCategory[]
> {
  try {
    console.log('🔄 Force refreshing categories...')
    return await fetchCategoriesFromAPI()
  } catch (error) {
    console.error('Error refreshing categories:', error)
    throw error
  }
}

// Get category by ID
export async function getCategoryById(
  id: string,
): Promise<HttpTypes.StoreProductCategory | null> {
  try {
    const categories = await getCategories()
    return categories.find((category) => category.id === id) || null
  } catch (error) {
    console.error('Error getting category by ID:', error)
    throw error
  }
}

// Get category by handle
export async function getCategoryByHandle(
  handle: string,
): Promise<HttpTypes.StoreProductCategory | null> {
  try {
    const categories = await getCategories()
    return categories.find((category) => category.handle === handle) || null
  } catch (error) {
    console.error('Error getting category by handle:', error)
    throw error
  }
}

// Get root categories (no parent)
export async function getRootCategories(): Promise<
  HttpTypes.StoreProductCategory[]
> {
  try {
    const categories = await getCategories()
    return categories.filter((category) => !category.parent_category_id)
  } catch (error) {
    console.error('Error getting root categories:', error)
    throw error
  }
}

// Get child categories
export async function getChildCategories(
  parentId: string,
): Promise<HttpTypes.StoreProductCategory[]> {
  try {
    const categories = await getCategories()
    return categories.filter(
      (category) => category.parent_category_id === parentId,
    )
  } catch (error) {
    console.error('Error getting child categories:', error)
    throw error
  }
}

// Get category path (breadcrumb)
export async function getCategoryPath(categoryId: string): Promise<string[]> {
  try {
    const categories = await getCategories()
    const category = categories.find((cat) => cat.id === categoryId)

    if (!category) return []

    const path: string[] = [category.handle]
    let current = category

    while (current.parent_category) {
      current = current.parent_category
      path.unshift(current.handle)
    }

    return path
  } catch (error) {
    console.error('Error getting category path:', error)
    throw error
  }
}

// Get cache status
export async function getCategoriesCacheStatus() {
  if (!serverCache) {
    return {
      hasCache: false,
      isStale: false,
      timeUntilExpiry: null,
      lastFetched: null,
    }
  }

  const isStale = !isCacheValid(serverCache.timestamp)
  const timeUntilExpiry = Math.max(
    0,
    CACHE_DURATION - (Date.now() - serverCache.timestamp),
  )

  return {
    hasCache: true,
    isStale,
    timeUntilExpiry,
    lastFetched: serverCache.timestamp,
    formattedTimeLeft:
      timeUntilExpiry > 0
        ? `${Math.floor(timeUntilExpiry / 60000)}m ${Math.floor(
            (timeUntilExpiry % 60000) / 1000,
          )}s`
        : 'Expired',
  }
}
