'use server'

import { revalidateTag } from 'next/cache'
import { getCacheTag, getCartId } from './cookies'
import { retrieveCart } from './cart'
import { sdk } from '@lib/config'

/**
 * Refresh cart prices by updating cart line items with new variant prices
 * Steps:
 * 1. Update variant prices are already updated by cron job
 * 2. Fetch current cart
 * 3. Update each line item to trigger price recalculation
 * 4. Invalidate cart cache
 */
export async function refreshCartPrices() {
  try {
    const cartId = await getCartId()

    if (!cartId) {
      throw new Error('No cart found')
    }

    // Step 1: Fetch current cart with items
    const cart = await retrieveCart(cartId)

    if (!cart || !cart.items || cart.items.length === 0) {
      console.log('Cart is empty, nothing to refresh')
      return {
        success: true,
        message: 'Cart is empty',
      }
    }

    // Step 2: Update each line item to trigger price recalculation
    // MedusaJS will fetch the latest variant price when updating line items
    for (const item of cart.items) {
      try {
        // Update the line item with the same quantity to trigger price refresh
        await sdk.store.cart.updateLineItem(cartId, item.id, {
          quantity: item.quantity,
        })
      } catch (error) {
        console.error(`Failed to update line item ${item.id}:`, error)
        // Continue with other items even if one fails
      }
    }

    // Step 3: Invalidate cart cache tags to force a fresh fetch
    const cartCacheTag = await getCacheTag('carts')
    if (cartCacheTag) {
      revalidateTag(cartCacheTag)
    }

    const fulfillmentCacheTag = await getCacheTag('fulfillment')
    if (fulfillmentCacheTag) {
      revalidateTag(fulfillmentCacheTag)
    }

    // Also invalidate the general carts tag
    revalidateTag('carts')

    return {
      success: true,
      message: 'Cart line items updated successfully',
    }
  } catch (error) {
    console.error('Error refreshing cart prices:', error)
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Failed to refresh cart prices: ${error.message}`)
    }
    throw error
  }
}
