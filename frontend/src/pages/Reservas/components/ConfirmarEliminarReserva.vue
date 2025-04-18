<template>
  <v-dialog
    v-model="show"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 bg-error text-white">
        <v-icon class="mr-2">mdi-calendar-remove</v-icon>
        Confirmar eliminación
      </v-card-title>
      
      <v-card-text class="pt-4">
        <p v-if="reserva" class="text-body-1">
          ¿Está seguro que desea eliminar la siguiente reserva?
        </p>
        
        <v-list v-if="reserva" lines="two" class="bg-grey-lighten-4 my-3">
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="primary" variant="tonal">
                <v-icon>mdi-calendar</v-icon>
              </v-avatar>
            </template>
            
            <v-list-item-title class="font-weight-medium">
              Fecha: {{ formatDate(reserva.fecha) }} a las {{ formatTime(reserva.hora) }}
            </v-list-item-title>
            
            <v-list-item-subtitle>
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
                {{ reserva.numero_de_personas }} personas
              </div>
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="secondary" variant="tonal">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </template>
            
            <v-list-item-title v-if="comensal" class="font-weight-medium">
              Comensal: {{ comensal.nombre }}
            </v-list-item-title>
            <v-list-item-title v-else class="font-weight-medium">
              Comensal ID: {{ reserva.id_comensal }}
            </v-list-item-title>
            
            <v-list-item-subtitle v-if="comensal">
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-1">mdi-phone</v-icon>
                {{ comensal.telefono }}
              </div>
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="info" variant="tonal">
                <v-icon>mdi-table-chair</v-icon>
              </v-avatar>
            </template>
            
            <v-list-item-title v-if="mesa" class="font-weight-medium">
              Mesa {{ mesa.numero_mesa }}
            </v-list-item-title>
            <v-list-item-title v-else class="font-weight-medium">
              Mesa ID: {{ reserva.id_mesa }}
            </v-list-item-title>
            
            <v-list-item-subtitle v-if="mesa">
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-1">mdi-information</v-icon>
                Capacidad: {{ mesa.capacidad }} - {{ mesa.ubicacion || 'Sin ubicación' }}
              </div>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        
        <div class="text-body-2 text-red">
          Esta acción no se puede deshacer.
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="text"
          @click="onCancel"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="elevated"
          @click="onConfirm"
          :loading="loading"
          :disabled="loading"
        >
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import type { Reserva } from '../../../types/Reserva';
import type { Comensal } from '../../../types/Comensal';
import type { Mesa } from '../../../types/Mesa';
import { fetchComensales } from '../../../api/comensales';
import { fetchMesas } from '../../../api/mesas';

const props = defineProps<{
  show: boolean;
  reserva: Reserva | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  'confirm': [];
  'cancel': [];
}>();

// Estado para almacenar detalles del comensal y mesa
const comensal = ref<Comensal | null>(null);
const mesa = ref<Mesa | null>(null);

// Cargar datos del comensal y mesa cuando cambia la reserva
watch(() => props.reserva, async (nuevaReserva) => {
  if (!nuevaReserva) {
    comensal.value = null;
    mesa.value = null;
    return;
  }
  
  // Si la reserva ya tiene los datos relacionados cargados
  if (nuevaReserva.comensal) {
    comensal.value = nuevaReserva.comensal;
  } else if (nuevaReserva.id_comensal) {
    try {
      const response = await fetchComensales({ id_comensal: nuevaReserva.id_comensal });
      if (response.data?.data && response.data.data.length > 0) {
        comensal.value = response.data.data[0];
      }
    } catch (error) {
      console.error('Error al cargar datos del comensal:', error);
    }
  }
  
  if (nuevaReserva.mesa) {
    mesa.value = nuevaReserva.mesa;
  } else if (nuevaReserva.id_mesa) {
    try {
      const response = await fetchMesas({ id_mesa: nuevaReserva.id_mesa });
      if (response.data?.data && response.data.data.length > 0) {
        mesa.value = response.data.data[0];
      }
    } catch (error) {
      console.error('Error al cargar datos de la mesa:', error);
    }
  }
}, { immediate: true });

// Evento de confirmación
const onConfirm = () => {
  emit('confirm');
};

// Evento de cancelación
const onCancel = () => {
  emit('cancel');
  emit('update:show', false);
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