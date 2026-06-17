import { useAppConfig } from '@core/config'
import { telemetry } from '@core/telemetry/telemetry.service'

// Plugin de inicialização da telemetria.
// Sufixo .client.ts = executa apenas no browser — correto para SDKs de RUM
// como Sentry, Datadog RUM ou OpenTelemetry que não fazem sentido no servidor.
export default defineNuxtPlugin(() => {
  const { enableTelemetry } = useAppConfig()

  if (!enableTelemetry) return

  // Aqui você inicializaria o SDK de telemetria escolhido, por exemplo:
  // Sentry.init({ dsn: runtimeConfig.public.sentryDsn, ... })
  // datadogRum.init({ applicationId: '...', clientToken: '...' })

  telemetry.trackEvent('app:boot')
})
