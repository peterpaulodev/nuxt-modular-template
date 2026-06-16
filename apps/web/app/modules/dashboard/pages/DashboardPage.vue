<script setup lang="ts">
import { APP_CONFIG } from "@core/config/app-config";
import { PageHeader } from "@shared/ui";
</script>

<template>
  <div>
    <PageHeader :title="APP_CONFIG.name" />
  </div>
</template>
