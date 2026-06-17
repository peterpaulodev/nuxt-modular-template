<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <header class="flex items-center gap-4 border-b border-gray-200 pb-6">
    <span
      class="h-10 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-purple-400 to-purple-700"
      aria-hidden="true"
    />
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">{{ title }}</h1>
      <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
    </div>
  </header>
</template>
