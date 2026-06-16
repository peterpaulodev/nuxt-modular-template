import { $fetch } from 'ofetch'

export const httpClient = $fetch.create({
  baseURL: '/api',

  onRequest({ options }) {
    // Futuramente:
    // Authorization
    // CorrelationId
    // Feature Flags
  },

  onResponseError({ response }) {
    console.error(
      `[HTTP ERROR] ${response.status} - ${response.statusText}`
    )
  },
})