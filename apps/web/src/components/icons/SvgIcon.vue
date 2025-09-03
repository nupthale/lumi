<template>
  <svg 
    :width="size" 
    :height="size" 
    :class="className"
  >
    <use :href="`#${name}`" />
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 18
  },
  className: {
    type: String,
    default: ''
  }
})
</script> 