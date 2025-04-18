<template>
  <v-table class="reservas-table">
    <thead>
      <tr>
        <th class="text-left">
          <div class="d-flex align-center" @click="cambiarOrden('fecha')">
            Fecha
            <v-icon
              v-if="sortBy === 'fecha'"
              :icon="sortDir === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'"
              size="small"
              class="ml-1"
            ></v-icon>
          </div>
        </th>
        <th class="text-left">
          <div class="d-flex align-center" @click="cambiarOrden('hora')">
            Hora
            <v-icon 
              v-if="sortBy === 'hora'"
              :icon="sortDir === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'"
              size="small"
              class="ml-1"
            ></v-icon>
          </div>
        </th>
        <th class="text-left">
          <div class="d-flex align-center" @click="cambiarOrden('numero_de_personas')">
            Personas
            <v-icon 
              v-if="sortBy === 'numero_de_personas'"
              :icon="sortDir === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'"
              size="small"
              class="ml-1"
            ></v-icon>
          </div>
        </th>
        <th class="text-left">Comensal</th>
        <th class="text-left">Mesa</th>
        <th class="text-center">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="cargando">
        <td colspan="6" class="text-center py-5">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="mt-2">Cargando reservas...</div>
        </td>
      </tr>
      
      <tr v-else-if="!reservas.length">
        <td colspan="6" class="text-center py-5">
          <v-icon icon="mdi-calendar-remove" size="large" color="grey"></v-icon>
          <div class="mt-2 text-grey">No se encontraron reservas</div>
        </td>
      </tr>
      
      <tr v-for="reserva in reservas" :key="reserva.id_reserva">
        <td>{{ formatDate(reserva.fecha) }}</td>
        <td>{{ formatTime(reserva.hora) }}</td>
        <td>{{ reserva.numero_de_personas }}</td>
        <td>
          <div v-if="reserva.comensal">
            {{ reserva.comensal.nombre }}
            <div class="text-caption text-grey">{{ reserva.comensal.telefono }}</div>
          </div>
          <div v-else>ID: {{ reserva.id_comensal }}</div>
        </td>
        <td>
          <div v-if="reserva.mesa">
            Mesa {{ reserva.mesa.numero_mesa }}
            <div class="text-caption text-grey">
              Capacidad: {{ reserva.mesa.capacidad }} - {{ reserva.mesa.ubicacion || 'Sin ubicación' }}
            </div>
          </div>
          <div v-else>ID: {{ reserva.id_mesa }}</div>
        </td>
        <td class="text-center">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            color="primary"
            @click="$emit('editar', reserva)"
          ></v-btn>
          
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="$emit('eliminar', reserva)"
          ></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import type { Reserva } from '../../../types/Reserva';

const props = defineProps<{
  reservas: Reserva[];
  cargando: boolean;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  'editar': [reserva: Reserva];
  'eliminar': [reserva: Reserva];
  'cambiar-orden': [campo: string, direccion: 'asc' | 'desc'];
}>();

// Cambiar orden de la tabla
const cambiarOrden = (campo: string) => {
  const nuevaDir = campo === props.sortBy && props.sortDir === 'asc' ? 'desc' : 'asc';
  emit('cambiar-orden', campo, nuevaDir);
};

// Formatear fecha (YYYY-MM-DD -> DD/MM/YYYY)
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateString;
  }
};

// Formatear hora (HH:MM:SS -> HH:MM)
const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  
  try {
    return timeString.substring(0, 5);
  } catch (e) {
    return timeString;
  }
};
</script>

<style scoped>
.reservas-table th {
  cursor: pointer;
  user-select: none;
}

.reservas-table th:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>