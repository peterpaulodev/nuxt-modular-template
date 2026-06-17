/**
 * Error hierarchy used across the application.
 *
 * AppError
 * ├── ApiError
 * ├── BusinessError
 * └── ValidationError
 *
 * Goals:
 * - Standardize error handling
 * - Improve observability
 * - Enable centralized logging
 * - Simplify UI error handling
 * - Support future integrations (Sentry, OpenTelemetry, Datadog)
 */

export * from './app-error'
export * from './business-error'
export * from './validation-error'
