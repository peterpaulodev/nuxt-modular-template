<script setup lang="ts">
import { telemetry } from '@core/telemetry/telemetry.service'
import { onMounted } from 'vue'

// error.vue é o handler global do Nuxt para erros não capturados (404, 500, etc.).
// O prop `error` é injetado automaticamente pelo Nuxt.
const props = defineProps<{
  error: { statusCode: number; message: string }
}>()

// Registra o erro na telemetria para observabilidade.
// Quando o SDK estiver integrado (Sentry, Datadog), este ponto já captura tudo.
onMounted(() => telemetry.trackError(props.error))

const handleClearError = () => clearError({ redirect: '/' })

const title = computed(() =>
  props.error.statusCode === 404 ? 'Página não encontrada' : 'Algo deu errado',
)
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8">
    <p class="text-6xl font-bold text-gray-200">{{ error.statusCode }}</p>
    <h1 class="text-xl font-semibold text-gray-800">{{ title }}</h1>
    <p class="text-sm text-gray-500">{{ error.message }}</p>
    <button
      class="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
      @click="handleClearError"
    >
      Voltar ao início
    </button>
  </div>
</template>
