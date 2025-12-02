'use server'

import { SiteConfig } from '@/types/site-config'
import { cache } from 'react'

const baseUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
const CACHE_KEY = 'site-configs-server-cache'

interface CacheData {
  configs: SiteConfig[]
  timestamp: number
}

// In-memory cache for server-side
let serverCache: CacheData | null = null

// Check if cache is valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION
}

// Load from server cache
const loadFromServerCache = (): SiteConfig[] | null => {
  if (!serverCache) return null

  if (isCacheValid(serverCache.timestamp)) {
    console.log('📦 Loading site configs from server cache')
    return serverCache.configs
  } else {
    console.log('⏰ Server cache expired, will fetch fresh data')
    serverCache = null
    return null
  }
}

// Save to server cache
const saveToServerCache = (configs: SiteConfig[]) => {
  serverCache = {
    configs,
    timestamp: Date.now(),
  }
  console.log('💾 Site configs saved to server cache')
}

// Cached fetch function
const fetchConfigsFromAPI = async (): Promise<SiteConfig[]> => {
  try {
    console.log('🌐 Fetching site configs from API...')
    const response = await fetch(`${baseUrl}/site-config`, {
      next: { revalidate: 300 }, // Next.js cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(response.statusText || 'Failed to fetch app data')
    }

    const data = await response.json()
    const configs = data.data || []

    // Save to server cache
    saveToServerCache(configs)

    return configs
  } catch (error) {
    console.error('Error fetching app data:', error)
    throw error
  }
}

export const getAppConfigs = cache(
  async (): Promise<SiteConfig[]> => {
    try {
      // Try to load from server cache first
      const cachedConfigs = loadFromServerCache()
      if (cachedConfigs) {
        return cachedConfigs
      }

      // Fetch fresh data if no valid cache
      return await fetchConfigsFromAPI()
    } catch (error) {
      console.error('Error in getAppConfigs:', error)
      throw error
    }
  },
)

// Force refresh function (bypasses cache)
export async function refreshAppConfigs(): Promise<SiteConfig[]> {
  try {
    console.log('🔄 Force refreshing site configs...')
    return await fetchConfigsFromAPI()
  } catch (error) {
    console.error('Error refreshing app data:', error)
    throw error
  }
}

// Get cache status
export async function getCacheStatus() {
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
