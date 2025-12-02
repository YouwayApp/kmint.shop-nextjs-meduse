'use server'

export const fetchMedusaApi = async (
  url: string,
  options: RequestInit = {},
) => {
  try {
    const baseUrl = process.env.MEDUSA_BACKEND_URL
    const response = await fetch(`${baseUrl}${url}`, options)
    return response.json()
  } catch (error) {
    console.error('Error fetching API:', error)
    return null
  }
}
