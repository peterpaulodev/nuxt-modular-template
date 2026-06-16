class TelemetryService {
  trackEvent(
    name: string,
    payload?: Record<string, unknown>
  ) {
    console.log('[EVENT]', name, payload)
  }

  trackError(error: unknown) {
    console.error('[ERROR]', error)
  }

  trackPageView(page: string) {
    console.log('[PAGE]', page)
  }
}

export const telemetry = new TelemetryService()