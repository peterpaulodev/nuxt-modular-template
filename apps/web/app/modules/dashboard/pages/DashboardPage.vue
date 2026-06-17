<script setup lang="ts">
import { PageHeader } from '@shared/ui'
import { onMounted } from 'vue'

import { useDashboard } from '../composables/useDashboard'

// Protege a rota com o middleware de autenticação.
// Remova esta linha para tornar a página pública.
definePageMeta({ middleware: 'auth' })

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
      <div class="rounded-lg border border-gray-200 p-6">
        <p class="text-sm text-gray-500">Usuários</p>
        <p class="mt-1 text-3xl font-semibold">{{ metrics.users }}</p>
      </div>
      <div class="rounded-lg border border-gray-200 p-6">
        <p class="text-sm text-gray-500">Transações</p>
        <p class="mt-1 text-3xl font-semibold">{{ metrics.transactions }}</p>
      </div>
    </div>
  </div>
</template>
