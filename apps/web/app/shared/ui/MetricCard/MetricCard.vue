<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
}>()
</script>

<template>
  <div class="rounded-lg border border-gray-200 border-l-4 border-l-purple-600 bg-white p-6 shadow-sm">
    <p class="text-sm font-medium text-purple-400 uppercase tracking-wide">{{ label }}</p>
    <p class="mt-2 text-3xl font-semibold text-purple-700">{{ value }}</p>
  </div>
</template>
