<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', disabled: false }
)
</script>

<template>
  <button
    :disabled="disabled"
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
$purple-50:  #faf5ff;
$purple-100: #f3e8ff;
$purple-600: #9333ea;
$purple-700: #7e22ce;
$purple-800: #6b21a8;

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  line-height: 1;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid $purple-600;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  // Variants
  &--primary {
    background-color: $purple-600;
    color: #fff;

    &:hover  { background-color: $purple-700; }
    &:active { background-color: $purple-800; }
  }

  &--secondary {
    background-color: transparent;
    color: $purple-600;
    border-color: $purple-600;

    &:hover  { background-color: $purple-50; }
    &:active { background-color: $purple-100; }
  }

  &--ghost {
    background-color: transparent;
    color: $purple-600;

    &:hover  { background-color: $purple-50; }
    &:active { background-color: $purple-100; }
  }

  // Sizes
  &--sm { padding: 6px 12px;  font-size: 0.875rem; }
  &--md { padding: 8px 16px;  font-size: 1rem;     }
  &--lg { padding: 12px 24px; font-size: 1.125rem; }
}
</style>
