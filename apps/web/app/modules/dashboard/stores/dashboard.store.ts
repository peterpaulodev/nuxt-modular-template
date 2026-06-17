import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { DashboardMetrics } from '../types'

// Estado persistente do módulo Dashboard.
// Sobrevive à navegação dentro da sessão.
// O composable useDashboard é o responsável por populá-lo — o store apenas armazena.
export const useDashboardStore = defineStore('dashboard', () => {
  const metrics = ref<DashboardMetrics | null>(null)

  return { metrics }
})
