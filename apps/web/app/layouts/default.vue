<script setup lang="ts">
import { useAppConfig } from '@core/config'

const { appName } = useAppConfig()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="border-b border-gray-200 bg-white px-8 py-4">
      <span class="font-semibold text-gray-900">{{ appName }}</span>
      <!-- Futuramente: navegação entre módulos, avatar do usuário, notificações -->
    </nav>

    <main class="mx-auto max-w-7xl">
      <slot />
    </main>

    <footer class="border-t border-gray-200 bg-white px-8 py-4 text-center text-sm text-gray-400">
      <!-- Futuramente: links de suporte, versão da aplicação -->
    </footer>
  </div>
</template>
