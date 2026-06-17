import { useAppConfig } from '@core/config'
import { $fetch } from 'ofetch'

import { ApiError } from './api-error'

export const createHttpClient = () => {
  const { apiBaseUrl } = useAppConfig()

  return $fetch.create({
    baseURL: apiBaseUrl,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRequest({ options }) {
      // Futuramente:
      // Authorization
      // CorrelationId
      // Feature Flags
    },

    async onResponseError({ response }) {
      throw new ApiError(response.statusText, response.status)
    },
  })
}
