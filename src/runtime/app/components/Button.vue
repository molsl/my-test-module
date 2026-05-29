<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <button @click="$emit('click')">
    <slot>{{ label }}</slot>
  </button>
</template>
