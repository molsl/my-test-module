<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <button 
    class="px-4 py-2 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    <slot>{{ label }}</slot>
  </button>
</template>