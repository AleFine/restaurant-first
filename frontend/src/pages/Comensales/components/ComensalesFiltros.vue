<template>
  <v-card class="mb-4" variant="outlined">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-filter-variant</v-icon>
      Filtros
      <v-spacer></v-spacer>
      <v-btn
        v-if="hasActiveFilters"
        density="comfortable"
        variant="text"
        color="error"
        prepend-icon="mdi-filter-remove"
        @click="clearFilters"
      >
        Limpiar filtros
      </v-btn>
    </v-card-title>
    
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="localFiltros.nombre"
            label="Nombre"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            prepend-inner-icon="mdi-account-search"
            @update:model-value="onFilterChange('nombre', $event)"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="localFiltros.correo"
            label="Correo"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            prepend-inner-icon="mdi-email-search"
            @update:model-value="onFilterChange('correo', $event)"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="localFiltros.telefono"
            label="Teléfono"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            prepend-inner-icon="mdi-phone"
            @update:model-value="onFilterChange('telefono', $event)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits, ref, computed, watch } from 'vue';
import { useDebounce } from '../../../composables/useDebounce';
import type { ComensalParams } from '../../../api/comensales';

const props = defineProps<{
  filtros: ComensalParams
}>();

const emit = defineEmits<{
  'update:filtros': [filtros: ComensalParams]
}>();

const { debounce } = useDebounce();

// Create a local copy of the filters
const localFiltros = ref({ ...props.filtros });

// Watch for external changes to filtros
watch(() => props.filtros, (newFiltros) => {
  localFiltros.value = { ...newFiltros };
}, { deep: true });

const hasActiveFilters = computed(() => {
  return !!localFiltros.value.nombre || !!localFiltros.value.correo || !!localFiltros.value.telefono;
});

const onFilterChange = (field: keyof ComensalParams, value: any) => {
  debounce(() => {
    // Create a new object to avoid modifying the original props object
    const newFiltros = { ...props.filtros, [field]: value };
    emit('update:filtros', newFiltros);
  }, 300);
};

const clearFilters = () => {
  const clearedFiltros = {
    nombre: '',
    correo: '',
    telefono: '',
  };

  localFiltros.value = { ...clearedFiltros };
  emit('update:filtros', clearedFiltros);
};
</script>