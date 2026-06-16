import { $fetch } from 'ofetch'
import { ApiError } from './api-error'

export const httpClient = $fetch.create({
  baseURL: '/api',

  onRequest({ options }) {
    // Futuramente:
    // Authorization
    // CorrelationId
    // Feature Flags
  },

  async onResponseError({ response }) {
    throw new ApiError(
      response.statusText,
      response.status
    )
  },
})