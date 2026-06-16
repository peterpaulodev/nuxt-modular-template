import { $fetch } from 'ofetch'
import { ApiError } from './api-error'
import { useAppConfig } from '@core/config'

export const createHttpClient = () => {
  const { apiBaseUrl } = useAppConfig()

  return $fetch.create({
    baseURL: apiBaseUrl,

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
}