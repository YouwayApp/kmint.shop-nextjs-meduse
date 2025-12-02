'use server'

import { sdk } from '@lib/config'
import medusaError from '@lib/util/medusa-error'
import { HttpTypes } from '@medusajs/types'
import { revalidateTag } from 'next/cache'
import { getAuthHeaders, getCacheOptions, getCacheTag } from './cookies'

export const listOrders = async (): Promise<HttpTypes.StoreOrder[] | null> => {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders) return null

  const headers = {
    ...authHeaders,
  }

  const next = {
    ...(await getCacheOptions('orders')),
  }

  return await sdk.client
    .fetch<{ orders: HttpTypes.StoreOrder[] }>(`/store/orders`, {
      method: 'GET',
      headers,
      next,
      cache: 'force-cache',
    })
    .then(({ orders }) => orders)
    .catch(() => null)
}

export const retrieveOrder = async (
  id: string,
): Promise<HttpTypes.StoreOrder | null> => {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders) return null

  const headers = {
    ...authHeaders,
  }

  const next = {
    ...(await getCacheOptions('orders')),
  }

  return await sdk.client
    .fetch<{ order: HttpTypes.StoreOrder }>(`/store/orders/${id}`, {
      method: 'GET',
      query: {
        fields:
          "*payment_collections,*payment_collections.payments,*payment_collections.payments.data,*items,*items.metadata,*items.variant,*items.variant.product,*items.variant.product.handle",
      },
      headers,
      next,
      cache: 'force-cache',
    })
    .then(({ order }) => order)
    .catch(() => null)
}

export const acceptTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const declineTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}
