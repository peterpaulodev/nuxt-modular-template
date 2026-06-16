export const getApiBaseUrl = () => {
  const config = useRuntimeConfig()

  return config.public.apiBaseUrl
}