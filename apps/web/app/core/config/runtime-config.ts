export const getApiBaseUrl = () => {
  const config = useRuntimeConfig()

  return config.public.apiBaseUrl
}

export const useAppConfig = () => {
  const config = useRuntimeConfig()

  return {
    apiBaseUrl: config.public.apiBaseUrl as string,

    appName: config.public.appName as string,

    appEnv: config.public.appEnv as string,

    enableTelemetry: config.public.enableTelemetry as boolean,
  }
}
