<template>
  <v-card elevation="2">
    <v-data-table
      :headers="headers"
      :items="mesas"
      :loading="loading"
      :items-per-page="itemsPerPage"
      class="elevation-0"
      density="comfortable"
    >
      <template v-slot:loading>
        <v-skeleton-loader
          type="table-row"
          class="pa-4"
        ></v-skeleton-loader>
      </template>
      
      <template v-slot:no-data>
        <div class="text-center pa-4">
          <v-icon size="large" color="info" class="mb-2">mdi-information</v-icon>
          <div>No hay mesas registradas</div>
        </div>
      </template>
      
      <template v-slot:item.ubicacion="{ item }">
        {{ item.ubicacion || 'No especificada' }}
      </template>
      
      <template v-slot:item.capacidad="{ item }">
        <v-chip
          size="small"
          :color="getCapacidadColor(item.capacidad)"
          text-color="white"
        >
          {{ item.capacidad }} personas
        </v-chip>
      </template>
      
      <template v-slot:item.actions="{ item }">
        <div class="d-flex gap-2">
          <v-tooltip text="Editar mesa" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                density="comfortable"
                icon
                color="primary"
                variant="text"
                @click="emit('editar', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          
          <v-tooltip text="Eliminar mesa" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                density="comfortable"
                icon
                color="error"
                variant="text"
                @click="emit('eliminar', item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import type { Mesa } from '../../../types/Mesa';
import type { DataTableHeader } from 'vuetify';

const { mesas, loading = false, itemsPerPage = 10 } = defineProps<{
  mesas: Mesa[];
  loading?: boolean;
  itemsPerPage?: number;
}>();

const emit = defineEmits<{
  (e: 'editar', mesa: Mesa): void;
  (e: 'eliminar', mesa: Mesa): void;
}>();

// Properly type the headers array using Vuetify's DataTableHeader type
const headers: DataTableHeader[] = [
  { title: 'ID', key: 'id_mesa', sortable: true, align: 'start' },
  { title: 'Número', key: 'numero_mesa', sortable: true },
  { title: 'Capacidad', key: 'capacidad', sortable: true },
  { title: 'Ubicación', key: 'ubicacion', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
];

// Función para determinar el color del chip de capacidad
const getCapacidadColor = (capacidad: number): string => {
  if (capacidad <= 2) return 'teal';
  if (capacidad <= 4) return 'blue';
  if (capacidad <= 6) return 'indigo';
  if (capacidad <= 8) return 'deep-purple';
  return 'red';
};
</script>