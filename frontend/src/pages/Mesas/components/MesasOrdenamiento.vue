<template>
  <div class="d-flex align-center">
    <v-icon class="mr-2">mdi-sort</v-icon>
    <span class="text-body-2 mr-2">Ordenar por:</span>
    
    <v-select
      v-model="localSortBy"
      :items="sortOptions"
      variant="outlined"
      density="comfortable"
      hide-details
      class="mr-2"
      style="max-width: 150px;"
    ></v-select>
    
    <v-btn-toggle
      v-model="localSortDir"
      mandatory
      density="comfortable"
      color="primary"
    >
      <v-btn value="asc" icon>
        <v-icon>mdi-sort-ascending</v-icon>
      </v-btn>
      <v-btn value="desc" icon>
        <v-icon>mdi-sort-descending</v-icon>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue';

const props = defineProps<{
  sortBy: string;
  sortDir: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  'update:sortBy': [value: string];
  'update:sortDir': [value: 'asc' | 'desc'];
  'update:ordenamiento': [];
}>();

const sortOptions = [
  { title: 'Número de Mesa', value: 'numero_mesa' },
  { title: 'Capacidad', value: 'capacidad' },
  { title: 'Ubicación', value: 'ubicacion' }
];

const localSortBy = ref(props.sortBy);
const localSortDir = ref(props.sortDir);

watch(localSortBy, (newValue) => {
  emit('update:sortBy', newValue);
  emit('update:ordenamiento');
});

watch(localSortDir, (newValue) => {
  emit('update:sortDir', newValue);
  emit('update:ordenamiento');
});

// Watch for external changes
watch(() => props.sortBy, (newValue) => {
  localSortBy.value = newValue;
});

watch(() => props.sortDir, (newValue) => {
  localSortDir.value = newValue;
});
</script>