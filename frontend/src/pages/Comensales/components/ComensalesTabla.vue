<template>
  <v-card elevation="2">
    <v-data-table
      :headers="headers"
      :items="comensales"
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
          <div>No hay comensales registrados</div>
        </div>
      </template>
      
      <template v-slot:item.telefono="{ item }">
        {{ item.telefono || 'No disponible' }}
      </template>
      
      <template v-slot:item.direccion="{ item }">
        {{ item.direccion || 'No disponible' }}
      </template>
      
      <template v-slot:item.actions="{ item }">
        <div class="d-flex gap-2">
          <v-tooltip text="Editar comensal" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                density="comfortable"
                icon
                color="primary"
                variant="text"
                @click="$emit('editar', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          
          <v-tooltip text="Eliminar comensal" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                density="comfortable"
                icon
                color="error"
                variant="text"
                @click="$emit('eliminar', item)"
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
import type { Comensal } from '../../../types/Comensal';
import type { DataTableHeader } from 'vuetify';

const { comensales, loading = false, itemsPerPage = 10 } = defineProps<{
  comensales: Comensal[];
  loading?: boolean;
  itemsPerPage?: number;
}>();

// Remove the unused warning by using defineEmits without assigning to a variable
defineEmits<{
  (e: 'editar', comensal: Comensal): void;
  (e: 'eliminar', comensal: Comensal): void;
}>();

// Properly type the headers array using Vuetify's DataTableHeader type
const headers: DataTableHeader[] = [
  { title: 'ID', key: 'id_comensal', sortable: true, align: 'start' },
  { title: 'Nombre', key: 'nombre', sortable: true }, // align defaults to 'start' when not specified
  { title: 'Correo', key: 'correo', sortable: true },
  { title: 'Teléfono', key: 'telefono', sortable: true },
  { title: 'Dirección', key: 'direccion', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
];
</script>