<template>
  <div>
    <p>{{ nome }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const nome = ref<string>()

nome.value = 'teste'
</script>
