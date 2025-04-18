<template>
  <v-card class="mb-4" variant="outlined">
    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-icon class="mr-2">mdi-filter-variant</v-icon>
        <div class="text-subtitle-1 font-weight-medium">Filtros</div>
        <v-spacer></v-spacer>
        <v-btn
          v-if="hasActiveFilters"
          size="small"
          variant="text"
          color="primary"
          prepend-icon="mdi-refresh"
          @click="resetFiltros"
        >
          Limpiar filtros
        </v-btn>
      </div>
      
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="localFiltros.numero_mesa"
            label="Número de Mesa"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            prepend-inner-icon="mdi-table-chair"
            @update:model-value="onFilterChange('numero_mesa', $event)"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="localFiltros.capacidad"
            label="Capacidad"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            type="number"
            prepend-inner-icon="mdi-account-group"
            @update:model-value="onFilterChange('capacidad', $event ? Number($event) : undefined)"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="localFiltros.ubicacion"
            label="Ubicación"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            prepend-inner-icon="mdi-map-marker"
            @update:model-value="onFilterChange('ubicacion', $event)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits, ref, computed, watch } from 'vue';
import { useDebounce } from '../../../composables/useDebounce';
import type { MesaParams } from '../../../api/mesas';

const props = defineProps<{
  filtros: MesaParams
}>();

const emit = defineEmits<{
  'update:filtros': [filtros: MesaParams]
}>();

const { debounce } = useDebounce();

// Create a local copy of the filters
const localFiltros = ref({ ...props.filtros });

// Watch for external changes to filtros
watch(() => props.filtros, (newFiltros) => {
  localFiltros.value = { ...newFiltros };
}, { deep: true });

const hasActiveFilters = computed(() => {
  return !!localFiltros.value.numero_mesa || !!localFiltros.value.capacidad || !!localFiltros.value.ubicacion;
});

const onFilterChange = (field: keyof MesaParams, value: any) => {
  debounce(() => {
    const newFiltros = { ...props.filtros, [field]: value };
    emit('update:filtros', newFiltros);
  }, 300);
};

const resetFiltros = () => {
  const resetedFiltros = { 
    ...props.filtros,
    numero_mesa: '',
    capacidad: undefined,
    ubicacion: ''
  };
  
  localFiltros.value = { ...resetedFiltros };
  emit('update:filtros', resetedFiltros);
};
</script>