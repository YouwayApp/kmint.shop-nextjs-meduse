import { useState, useEffect } from 'react'

interface StrapiResponse<T> {
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

interface StrapiError {
  error: {
    status: number
    name: string
    message: string
  }
}

interface UseStrapiOptions {
  populate?: string | string[]
  sort?: string | string[]
  filters?: Record<string, string | number | boolean>
  pagination?: {
    page?: number
    pageSize?: number
  }
  locale?: string
}

interface UseStrapiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN

// Strapi API utility functions
export const strapiApi = {
  // GET request
  async get<T>(
    endpoint: string,
    options: UseStrapiOptions = {},
  ): Promise<StrapiResponse<T>> {
    const url = new URL(`${STRAPI_URL}/api${endpoint}`)

    // Add query parameters
    if (options.populate) {
      url.searchParams.append(
        'populate',
        Array.isArray(options.populate)
          ? options.populate.join(',')
          : options.populate,
      )
    }

    if (options.sort) {
      url.searchParams.append(
        'sort',
        Array.isArray(options.sort) ? options.sort.join(',') : options.sort,
      )
    }

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        url.searchParams.append(`filters[${key}]`, String(value))
      })
    }

    if (options.pagination) {
      if (options.pagination.page) {
        url.searchParams.append(
          'pagination[page]',
          options.pagination.page.toString(),
        )
      }
      if (options.pagination.pageSize) {
        url.searchParams.append(
          'pagination[pageSize]',
          options.pagination.pageSize.toString(),
        )
      }
    }

    if (options.locale) {
      url.searchParams.append('locale', options.locale)
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorData: StrapiError = await response.json()
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`,
      )
    }

    return response.json()
  },

  // POST request
  async post<T>(endpoint: string, data: unknown): Promise<StrapiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`
    }

    const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      const errorData: StrapiError = await response.json()
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`,
      )
    }

    return response.json()
  },

  // PUT request
  async put<T>(endpoint: string, data: unknown): Promise<StrapiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`
    }

    const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      const errorData: StrapiError = await response.json()
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`,
      )
    }

    return response.json()
  },

  // DELETE request
  async delete<T>(endpoint: string): Promise<StrapiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`
    }

    const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const errorData: StrapiError = await response.json()
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`,
      )
    }

    return response.json()
  },
}

// Custom hook for fetching Strapi data
export function useStrapi<T>(
  endpoint: string,
  options: UseStrapiOptions = {},
  dependencies: unknown[] = [],
): UseStrapiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await strapiApi.get<T>(endpoint, options)
      setData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint, JSON.stringify(options), ...dependencies]) // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = () => {
    fetchData()
  }

  return { data, loading, error, refetch }
}

// Hook for single item
export function useStrapiItem<T>(
  endpoint: string,
  id: string | number,
  options: UseStrapiOptions = {},
): UseStrapiReturn<T> {
  return useStrapi<T>(`${endpoint}/${id}`, options, [id])
}

export default useStrapi
