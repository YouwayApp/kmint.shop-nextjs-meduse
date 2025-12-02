'use server'

import { sdk } from '@lib/config'
import { getAuthHeaders, getCacheOptions } from './cookies'

export interface Iban {
  id: string
  accountHolderName: string
  iban: string
  bankName: string
  branchName?: string | null
  isActive: boolean
  isDefault: boolean
  description?: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export const getActiveIbans = async (): Promise<Iban[] | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions('ibans')),
  }

  try {
    const response = await sdk.client.fetch<{ success: boolean; data: Iban[] }>(
      `/store/iban`,
      {
        method: 'GET',
        headers,
        next,
        cache: 'no-cache',
      },
    )

    if (response.success) {
      return response.data
    }
    return null
  } catch (error) {
    console.error('Error fetching IBANs:', error)
    return null
  }
}
