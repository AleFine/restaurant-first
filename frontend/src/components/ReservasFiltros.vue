<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-filter-variant" class="mr-2"></v-icon>
      Filtros
      <v-spacer></v-spacer>
      
      <v-btn
        color="primary"
        variant="text"
        size="small"
        prepend-icon="mdi-refresh"
        @click="limpiarFiltros"
      >
        Limpiar filtros
      </v-btn>
    </v-card-title>
    
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filtroInterno.fecha"
            label="Fecha"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            placeholder="Seleccione fecha"
            prepend-inner-icon="mdi-calendar"
            clearable
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-select
            v-model="filtroInterno.id_comensal"
            :items="comensales"
            item-title="nombre"
            item-value="id_comensal"
            label="Comensal"
            variant="outlined"
            density="compact"
            hide-details
            placeholder="Seleccione comensal"
            prepend-inner-icon="mdi-account"
            clearable
          >
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props" :subtitle="item.raw.telefono">
                {{ item.raw.nombre }}
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-select
            v-model="filtroInterno.id_mesa"
            :items="mesasConDisplayName"
            item-title="display_name"
            item-value="id_mesa"
            label="Mesa"
            variant="outlined"
            density="compact"
            hide-details
            placeholder="Seleccione mesa"
            prepend-inner-icon="mdi-table-chair"
            clearable
          >
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props" :subtitle="`Capacidad: ${item.raw.capacidad}`">
                display_name: {{ item.raw.display_name }}
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="filtroInterno.personas"
            label="Número de personas"
            type="number"
            variant="outlined"
            density="compact"
            hide-details
            placeholder="Cantidad de personas"
            prepend-inner-icon="mdi-account-group"
            clearable
            min="1"
          ></v-text-field>
        </v-col>
      </v-row>
      
      <v-row class="mt-2">
        <v-col cols="12" class="text-right">
          <v-btn
            color="primary"
            variant="elevated"
            @click="aplicarFiltros"
            prepend-icon="mdi-filter"
            size="small"
          >
            Aplicar filtros
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { fetchComensales } from '../api/comensales';
import { fetchMesas } from '../api/mesas';
import type { Comensal } from '../types/Comensal';
import type { Mesa } from '../types/Mesa';

// Props y emits
const props = defineProps<{
  filtros: {
    fecha: string;
    id_comensal: number | null;
    id_mesa: number | null;
    personas: number | null;
  }
}>();

const emit = defineEmits<{
  'aplicar-filtros': [filtros: any];
  'limpiar-filtros': [];
}>();

// Datos internos
const comensales = ref<Comensal[]>([]);
const mesas = ref<Mesa[]>([]);
const filtroInterno = reactive({
  fecha: props.filtros.fecha || '',
  id_comensal: props.filtros.id_comensal,
  id_mesa: props.filtros.id_mesa,
  personas: props.filtros.personas
});

// Computed para mesas con display_name
const mesasConDisplayName = computed(() => {
  return mesas.value.map(mesa => ({
    ...mesa,
    display_name: `Mesa ${mesa.numero_mesa} (${mesa.ubicacion || 'Sin ubicación'})`
  }));
});

// Métodos
const aplicarFiltros = () => {
  const filtrosAplicados = {
    fecha: filtroInterno.fecha,
    id_comensal: filtroInterno.id_comensal,
    id_mesa: filtroInterno.id_mesa,
    personas: filtroInterno.personas
  };
  
  emit('aplicar-filtros', filtrosAplicados);
};

const limpiarFiltros = () => {
  filtroInterno.fecha = '';
  filtroInterno.id_comensal = null;
  filtroInterno.id_mesa = null;
  filtroInterno.personas = null;
  
  emit('limpiar-filtros');
};

// Cargar datos al montar
onMounted(async () => {
  try {
    // Cargar comensales
    const comensalesResponse = await fetchComensales();
    comensales.value = comensalesResponse.data?.data || [];
    
    // Cargar mesas
    const mesasResponse = await fetchMesas();
    mesas.value = mesasResponse.data?.data || [];
  } catch (error) {
    console.error('Error al cargar datos para filtros:', error);
  }
});

// Actualizar filtros internos cuando cambian los props
watch(() => props.filtros, (newFiltros) => {
  filtroInterno.fecha = newFiltros.fecha || '';
  filtroInterno.id_comensal = newFiltros.id_comensal;
  filtroInterno.id_mesa = newFiltros.id_mesa;
  filtroInterno.personas = newFiltros.personas;
}, { deep: true });
</script>