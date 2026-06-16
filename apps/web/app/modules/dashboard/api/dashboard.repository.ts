import { httpClient } from '@core/api/http-client'

export interface DashboardMetrics {
  users: number
  transactions: number
}

export class DashboardRepository {
  async getMetrics() {
    return httpClient<DashboardMetrics>('/dashboard')
  }
}