// An example telemetry utility for tracking events and errors in the application.
export const telemetry = {
  trackEvent(event: string, payload?: unknown) {
    console.log('[Telemetry]', event, payload)
  },

  trackError(error: unknown) {
    console.error('[Telemetry]', error)
  },
}