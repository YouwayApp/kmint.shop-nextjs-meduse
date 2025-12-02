'use server'

import { sdk } from '@lib/config'
import medusaError from '@lib/util/medusa-error'
import { HttpTypes } from '@medusajs/types'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from './cookies'

export const retrieveCustomer = async (): Promise<HttpTypes.StoreCustomer | null> => {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders) return null

  const headers = {
    ...authHeaders,
  }

  const next = {
    ...(await getCacheOptions('customers')),
  }

  return await sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
      method: 'GET',
      query: {
        fields: '*orders',
      },
      headers,
      next,
      cache: 'force-cache',
    })
    .then(({ customer }) => customer)
    .catch((error) => {
      console.error('Error fetching customer:', error)
      return null
    })
}

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag('customers')
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const customerForm = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    phone: (formData.get('phone') as string).replace(/\s/g, ''),
  }

  try {
    // Start registration process - this will send OTP
    const response = await sdk.client.fetch<{
      success: boolean
      location?: string
      error?: string
    }>(`/auth/customer/phone-auth/register`, {
      method: 'POST',
      body: {
        phone: customerForm.phone,
      },
    })

    if (response.success && response.location === 'otp') {
      // Store customer data temporarily for after OTP verification
      // In a real app, you might store this in session or temporary storage
      return {
        success: true,
        message: 'Please verify your phone number with the OTP sent.',
        requiresOtp: true,
        phone: customerForm.phone,
        customerData: customerForm, // Store for later use
      }
    } else {
      return {
        success: false,
        error: response.error || 'Failed to start registration process',
      }
    }
  } catch (error) {
    return { success: false, error: error.toString() }
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await sdk.auth
      .login('customer', 'emailpass', { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        const customerCacheTag = await getCacheTag('customers')
        revalidateTag(customerCacheTag)
      })

    await transferCart()

    return { success: true, message: 'Login successful' }
  } catch (error) {
    return { success: false, error: error.toString() }
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag('customers')
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag('carts')
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag('carts')
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData,
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    company: formData.get('company') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    city: formData.get('city') as string,
    postal_code: formData.get('postal_code') as string,
    province: formData.get('province') as string,
    country_code: formData.get('country_code') as string,
    phone: formData.get('phone') as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag('customers')
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string,
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag('customers')
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData,
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get('addressId') as string)

  if (!addressId) {
    return { success: false, error: 'Address ID is required' }
  }

  const address = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    company: formData.get('company') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    city: formData.get('city') as string,
    postal_code: formData.get('postal_code') as string,
    province: formData.get('province') as string,
    country_code: formData.get('country_code') as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get('phone') as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag('customers')
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

// Password reset functions
export async function requestPasswordReset(
  _currentState: unknown,
  formData: FormData,
) {
  const email = formData.get('email') as string

  try {
    await sdk.auth.resetPassword('customer', 'emailpass', {
      identifier: email,
    })

    return { success: true, message: 'Password reset email sent' }
  } catch (error) {
    return { success: false, error: error.toString() }
  }
}

export async function updatePassword(
  _currentState: unknown,
  formData: FormData,
) {
  const password = formData.get('password') as string
  const token = formData.get('token') as string

  try {
    await sdk.auth.updateProvider(
      'customer',
      'emailpass',
      {
        password,
      },
      token,
    )

    return { success: true, message: 'Password updated successfully' }
  } catch (error) {
    return { success: false, error: error.toString() }
  }
}

export const authenticateWithPhone = async (phone: string) => {
  try {
    const cleanPhone = phone.replace(/\s/g, '')
    const response = await sdk.auth.login('customer', 'phone-auth', {
      phone: cleanPhone,
    })

    if (
      typeof response === 'string' ||
      !response.location ||
      response.location !== 'otp'
    ) {
      throw new Error('Failed to login')
    }

    return true
  } catch (error) {
    return error.toString()
  }
}

export const verifyOtp = async ({
  otp,
  phone,
  customerData,
}: {
  otp: string
  phone: string
  customerData?: {
    first_name: string
    last_name: string
    password: string
    birthday: string
    tc: string
    phone: string
  }
}) => {
  try {
    const token = await sdk.auth.callback('customer', 'phone-auth', {
      phone,
      otp,
    })

    await sdk.client.setToken(token)

    await setAuthToken(token)

    const customerCacheTag = await getCacheTag('customers')
    revalidateTag(customerCacheTag)

    await transferCart()

    return true
  } catch (e) {
    return e.toString()
  }
}

interface CustomerRegisterForm {
  first_name: string
  last_name: string
  password: string
  birthday: string
  tc: string
  phone: string
}

interface CustomerOtpForm {
  phone: string
  otp: string
}

export const registerWithPhone = async (
  formData: CustomerRegisterForm | CustomerOtpForm,
) => {
  const phone = formData.phone.replace(/\s/g, '')
  try {
    // Check if this is OTP verification (has otp property)
    if ('otp' in formData) {
      // This is OTP verification
      const response = await sdk.client.fetch<{
        success: boolean
        message?: string
        error?: string
        token?: string
      }>(`/phone-auth/register`, {
        method: 'POST',
        body: {
          phone: phone,
          otp: formData.otp,
        },
      })

      if (response.success) {
        return {
          success: true,
          message: response.message || 'OTP verified successfully',
          token: response.token,
        }
      } else {
        return {
          success: false,
          error: response.error || 'OTP verification failed',
        }
      }
    } else {
      // This is initial registration
      const response = await sdk.client.fetch<{
        success: boolean
        location?: string
        error?: string
      }>(`/phone-auth/register`, {
        method: 'POST',
        body: {
          phone: phone,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          birthday: formData.birthday,
          tc: formData.tc,
        },
      })

      if (response.success && response.location === 'otp') {
        // Store customer data temporarily for after OTP verification
        return {
          success: true,
          message: 'Please verify your phone number with the OTP sent.',
          requiresOtp: true,
          phone: formData.phone,
          customerData: formData, // Store for later use
        }
      } else {
        return {
          success: false,
          error: response.error || 'Failed to start registration process',
        }
      }
    }
  } catch (error) {
    return { success: false, error: error.toString() }
  }
}
