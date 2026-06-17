<script setup lang="ts">
import DashboardPage from '@modules/dashboard/pages/DashboardPage.vue'

// Protege a rota com o middleware de autenticação.
// Remova esta linha para tornar a página pública.
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <DashboardPage />
</template>
