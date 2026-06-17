import { ApiError } from '@core/api'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { DashboardRepository } from '../api/dashboard.repository'
import { useDashboardStore } from '../stores/dashboard.store'

// O composable é o orquestrador da feature.
// Estado persistente (metrics) fica no store; estado de tela (isLoading, error) fica local.
export const useDashboard = () => {
  const store = useDashboardStore()
  const { metrics } = storeToRefs(store)

  const repository = new DashboardRepository()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadMetrics = async () => {
    isLoading.value = true
    error.value = null

    try {
      store.metrics = await repository.getMetrics()
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

