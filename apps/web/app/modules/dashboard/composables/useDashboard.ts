import { ApiError } from '@core/api'
import { ref } from 'vue'

import { DashboardRepository } from '../api/dashboard.repository'
import type { DashboardMetrics } from '../types'

// O composable é o orquestrador da feature.
// Gerencia estado local (loading, error, dados) e delega IO para o repository.
export const useDashboard = () => {
  const repository = new DashboardRepository()

  const metrics = ref<DashboardMetrics | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadMetrics = async () => {
    isLoading.value = true
    error.value = null

    try {
      metrics.value = await repository.getMetrics()
    } catch (e) {
      // ApiError é lançado pelo HttpClient quando a API retorna um status de erro.
      // Outros erros (ex: rede offline) caem no else.
      if (e instanceof ApiError) {
        error.value = `Erro ${e.status ?? ''}: ${e.message}`.trim()
      } else {
        error.value = 'Erro inesperado. Tente novamente.'
      }
    } finally {
      isLoading.value = false
    }
  }

  return { metrics, isLoading, error, loadMetrics }
}

