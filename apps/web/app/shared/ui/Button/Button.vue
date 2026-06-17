<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { computed } from "vue";

const button = cva(
  "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
        secondary:
          "border border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100",
        ghost: "text-purple-600 hover:bg-purple-50 active:bg-purple-100",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = VariantProps<typeof button>;

const props = withDefaults(
  defineProps<{
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    size: "md",
    disabled: false,
  },
);

const classes = computed(() =>
  button({ variant: props.variant, size: props.size }),
);
</script>

<template>
  <button :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
