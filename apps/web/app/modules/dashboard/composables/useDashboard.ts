import { DashboardRepository } from '../api/dashboard.repository'

export const useDashboard = () => {
  const repository = new DashboardRepository()

  const loadMetrics = async () => {
    return repository.getMetrics()
  }

  return {
    loadMetrics,
  }
}
