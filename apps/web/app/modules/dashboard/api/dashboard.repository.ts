import { createHttpClient } from '@core/api/http-client'

export interface DashboardMetrics {
  users: number
  transactions: number
}

export class DashboardRepository {
  async getMetrics() {
    return createHttpClient()<DashboardMetrics>('/dashboard')
  }
}