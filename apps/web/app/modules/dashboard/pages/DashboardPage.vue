<script setup lang="ts">
import { MetricCard, PageHeader } from '@shared/ui'
import { formatNumber } from '@shared/utils/format'
import { onMounted } from 'vue'

import { useDashboard } from '../composables/useDashboard'

// A Page é o ponto de entrada do módulo.
// Ela compõe o composable e delega toda a lógica para ele.
const { metrics, isLoading, error, loadMetrics } = useDashboard()

onMounted(loadMetrics)
</script>

<template>
  <div class="p-8">
    <PageHeader title="Dashboard" />

    <div v-if="isLoading" class="mt-6 text-gray-500">Carregando métricas...</div>

    <div v-else-if="error" class="mt-6 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="metrics" class="mt-6 grid grid-cols-2 gap-4">
      <MetricCard label="Usuários" :value="formatNumber(metrics.users)" />
      <MetricCard label="Transações" :value="formatNumber(metrics.transactions)" />
    </div>
  </div>
</template>
