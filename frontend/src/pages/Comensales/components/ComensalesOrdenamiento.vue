<template>
  <div class="flex items-center">
    <span class="mr-2 text-sm text-gray-700">Ordenar por:</span>
    <select 
      :value="sortBy" 
      @change="onSortByChange"
      class="p-2 border rounded mr-2"
    >
      <option value="nombre">Nombre</option>
      <option value="correo">Correo</option>
      <option value="telefono">Teléfono</option>
    </select>
    
    <select 
      :value="sortDir" 
      @change="onSortDirChange"
      class="p-2 border rounded"
    >
      <option value="asc">Ascendente</option>
      <option value="desc">Descendente</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  sortBy: string;
  sortDir: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  'update:sortBy': [value: string];
  'update:sortDir': [value: 'asc' | 'desc'];
  'update:ordenamiento': [];
}>();

const onSortByChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:sortBy', target.value);
  emit('update:ordenamiento');
};

const onSortDirChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:sortDir', target.value as 'asc' | 'desc');
  emit('update:ordenamiento');
};
</script>