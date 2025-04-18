<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <h1 class="text-h4 font-weight-bold">
            <v-icon size="x-large" class="mr-2">mdi-calendar-edit</v-icon>
            Editar Reserva
          </h1>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            prepend-icon="mdi-arrow-left"
            :to="'/reservas'"
            variant="text"
          >
            Volver al listado
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="loading && !reserva.id_reserva">
      <v-col cols="12">
        <v-sheet class="pa-6 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <div class="mt-4">Cargando datos de la reserva...</div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          closable
        >
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card>
          <v-form @submit.prevent="guardar" ref="form">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="reserva.fecha"
                    label="Fecha"
                    type="date"
                    variant="outlined"
                    :rules="[v => !!v || 'La fecha es requerida', validateDate]"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="reserva.hora"
                    label="Hora"
                    type="time"
                    variant="outlined"
                    :rules="[v => !!v || 'La hora es requerida']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="reserva.numero_de_personas"
                    label="Número de personas"
                    type="number"
                    variant="outlined"
                    min="1"
                    :rules="[
                      v => !!v || 'El número de personas es requerido',
                      v => v > 0 || 'El número debe ser mayor a 0'
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="reserva.id_comensal"
                    :items="comensales"
                    item-title="nombre"
                    item-value="id_comensal"
                    label="Comensal"
                    variant="outlined"
                    :rules="[v => !!v || 'El comensal es requerido']"
                    required
                  ></v-select>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="reserva.id_mesa"
                    :items="mesasFiltradas"
                    item-title="display_text"
                    item-value="id_mesa"
                    label="Mesa"
                    variant="outlined"
                    :rules="[v => !!v || 'La mesa es requerida']"
                    :disabled="!reserva.numero_de_personas"
                    :hint="mesaHint"
                    persistent-hint
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
            
            <v-divider></v-divider>
            
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn
                color="secondary"
                variant="text"
                :to="'/reservas'"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                variant="elevated"
                :loading="saving"
                :disabled="saving"
              >
                Guardar cambios
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Snackbar para mensajes -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="5000"
      location="top"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSnackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useReservasStore } from '../composables/useReservasStore';
import type { Reserva } from '../../../types/Reserva';
import type { Comensal } from '../../../types/Comensal';
import type { Mesa } from '../../../types/Mesa';
import { fetchComensales } from '../../../api/comensales';
import { fetchMesas } from '../../../api/mesas';

const router = useRouter();
const route = useRoute();
const form = ref<any>(null);
const { obtenerReserva, modificarReserva } = useReservasStore();

const comensales = ref<Comensal[]>([]);
const mesas = ref<Mesa[]>([]);
const loading = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);

// Fecha actual en formato YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

// Snackbar state
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Datos de la reserva
const reserva = reactive<Reserva>({
  fecha: today,
  hora: '19:00',
  numero_de_personas: 2,
  id_comensal: 0,
  id_mesa: 0
});

// ID de la reserva a editar
const reservaId = computed(() => {
  const id = route.params.id;
  return typeof id === 'string' ? parseInt(id, 10) : 0;
});

// Filtrar mesas según la capacidad necesaria pero incluyendo siempre la mesa actual
const mesasFiltradas = computed(() => {
  if (!reserva.numero_de_personas) return [];
  
  // Incluir todas las mesas con capacidad suficiente y siempre la mesa actual
  return mesas.value
    .filter(mesa => mesa.capacidad >= reserva.numero_de_personas || mesa.id_mesa === reserva.id_mesa)
    .map(mesa => {
      const isMesaActual = mesa.id_mesa === reserva.id_mesa;
      const capacidadSuficiente = mesa.capacidad >= reserva.numero_de_personas;
      
      let displayText = `Mesa ${mesa.numero_mesa} - Capacidad: ${mesa.capacidad}`;
      
      if (mesa.ubicacion) {
        displayText += ` - ${mesa.ubicacion}`;
      }
      
      if (isMesaActual && !capacidadSuficiente) {
        displayText += ' (Capacidad insuficiente)';
      }
      
      return {
        ...mesa,
        display_text: displayText
      };
    });
});

// Mensaje informativo sobre las mesas disponibles
const mesaHint = computed(() => {
  if (!reserva.numero_de_personas) return 'Seleccione el número de personas primero';
  
  const mesasDisponibles = mesasFiltradas.value.filter(mesa => 
    mesa.id_mesa !== reserva.id_mesa && mesa.capacidad >= reserva.numero_de_personas
  ).length;
  
  if (mesasDisponibles === 0) {
    return 'No hay otras mesas disponibles para ese número de personas';
  }
  
  return `${mesasDisponibles} mesas disponibles para ${reserva.numero_de_personas} personas`;
});

// Validación para asegurar que la fecha no sea anterior a hoy
const validateDate = (value: string) => {
  if (!value) return true;
  // Para edición permitimos la fecha original aunque sea pasada
  if (reserva.id_reserva && value === reserva.fecha) return true;
  return value >= today || 'La fecha debe ser hoy o posterior';
};

// Cargar datos iniciales
onMounted(async () => {
  if (!reservaId.value) {
    error.value = 'ID de reserva no válido';
    loading.value = false;
    return;
  }
  
  try {
    const [comensalesResponse, mesasResponse, reservaData] = await Promise.all([
      fetchComensales(),
      fetchMesas(),
      obtenerReserva(reservaId.value)
    ]);
    
    if (comensalesResponse.data?.data) {
      comensales.value = comensalesResponse.data.data;
    }
    
    if (mesasResponse.data?.data) {
      mesas.value = mesasResponse.data.data;
    }
    
    // Formatear la hora para el input time (HH:MM)
    if (reservaData.hora) {
      reservaData.hora = reservaData.hora.split(':').slice(0, 2).join(':');
    }
    
    // Actualizar el estado reactivo con los datos de la reserva
    Object.assign(reserva, reservaData);
    
  } catch (error: any) {
    console.error('Error al cargar datos iniciales:', error);
    error.value = error.response?.data?.message || 'Error al cargar la reserva';
  } finally {
    loading.value = false;
  }
});

// Guardar los cambios
const guardar = async () => {
  const { valid } = await form.value.validate();
  
  if (!valid) return;
  
  saving.value = true;
  
  try {
    await modificarReserva(reservaId.value, reserva);
    
    showSnackbar.value = true;
    snackbarText.value = 'Reserva actualizada exitosamente';
    snackbarColor.value = 'success';
    
    // Redirigir al listado después de un breve retraso
    setTimeout(() => {
      router.push('/reservas');
    }, 1500);
  } catch (error: any) {
    console.error('Error al actualizar reserva:', error);
    
    showSnackbar.value = true;
    snackbarColor.value = 'error';
    
    // Mostrar mensaje específico según el error
    if (error.response?.status === 422) {
      // Error de validación
      if (error.response.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        snackbarText.value = errorMessages.join('. ');
      } else {
        snackbarText.value = error.response.data?.message || 'Error de validación en el formulario';
      }
    } else if (error.response?.status === 409) {
      // Conflicto (mesa ya reservada)
      snackbarText.value = 'La mesa ya está reservada para esa fecha y hora';
    } else {
      snackbarText.value = 'Error al actualizar la reserva. Intente nuevamente.';
    }
  } finally {
    saving.value = false;
  }
};
</script>