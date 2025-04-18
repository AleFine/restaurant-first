<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <h1 class="text-h4 font-weight-bold">
            <v-icon size="x-large" class="mr-2">mdi-calendar-plus</v-icon>
            Nueva Reserva
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

    <v-row>
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
                  >
                    <template v-slot:prepend-item>
                      <v-btn
                        variant="text"
                        color="primary"
                        block
                        class="mb-2"
                        prepend-icon="mdi-account-plus"
                        @click="irCrearComensal"
                      >
                        Nuevo comensal
                      </v-btn>
                    </template>
                  </v-select>
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
                :loading="loading"
                :disabled="loading"
              >
                Guardar
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
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useReservasStore } from '../composables/useReservasStore';
import type { Reserva } from '../../../types/Reserva';
import type { Comensal } from '../../../types/Comensal';
import type { Mesa } from '../../../types/Mesa';
import { fetchComensales } from '../../../api/comensales';
import { fetchMesas } from '../../../api/mesas';

const router = useRouter();
const form = ref<any>(null);
const { guardarReserva } = useReservasStore();

const comensales = ref<Comensal[]>([]);
const mesas = ref<Mesa[]>([]);
const loading = ref(false);

// Snackbar state
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Fecha actual en formato YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

// Estado inicial de la reserva
const reserva = reactive<Reserva>({
  fecha: today,
  hora: '19:00',
  numero_de_personas: 2,
  id_comensal: 0,
  id_mesa: 0
});

// Filtrar mesas según la capacidad necesaria
const mesasFiltradas = computed(() => {
  if (!reserva.numero_de_personas) return [];
  
  return mesas.value
    .filter(mesa => mesa.capacidad >= reserva.numero_de_personas)
    .map(mesa => ({
      ...mesa,
      display_text: `Mesa ${mesa.numero_mesa} - Capacidad: ${mesa.capacidad} - ${mesa.ubicacion || 'Sin ubicación'}`
    }));
});

// Mensaje informativo sobre las mesas disponibles
const mesaHint = computed(() => {
  if (!reserva.numero_de_personas) return 'Seleccione el número de personas primero';
  
  const mesasDisponibles = mesasFiltradas.value.length;
  if (mesasDisponibles === 0) {
    return 'No hay mesas disponibles para ese número de personas';
  }
  
  return `${mesasDisponibles} mesas disponibles para ${reserva.numero_de_personas} personas`;
});

// Validación para asegurar que la fecha no sea anterior a hoy
const validateDate = (value: string) => {
  if (!value) return true;
  return value >= today || 'La fecha debe ser hoy o posterior';
};

// Cargar datos iniciales
onMounted(async () => {
  try {
    const [comensalesResponse, mesasResponse] = await Promise.all([
      fetchComensales(),
      fetchMesas()
    ]);
    
    if (comensalesResponse.data?.data) {
      comensales.value = comensalesResponse.data.data;
    }
    
    if (mesasResponse.data?.data) {
      mesas.value = mesasResponse.data.data;
    }
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    showSnackbar.value = true;
    snackbarText.value = 'Error al cargar los datos necesarios';
    snackbarColor.value = 'error';
  }
});

// Vigilar cambios en el número de personas para resetear la mesa si es necesario
watch(() => reserva.numero_de_personas, (newValue, oldValue) => {
  if (newValue !== oldValue && reserva.id_mesa) {
    const mesaSeleccionada = mesas.value.find(m => m.id_mesa === reserva.id_mesa);
    if (mesaSeleccionada && mesaSeleccionada.capacidad < newValue) {
      // La mesa seleccionada ya no tiene capacidad suficiente
      reserva.id_mesa = 0;
    }
  }
});

// Ir a crear un nuevo comensal
const irCrearComensal = () => {
  router.push('/comensales/nuevo?redirect=reservas/nuevo');
};

// Guardar la reserva
const guardar = async () => {
  const { valid } = await form.value.validate();
  
  if (!valid) return;
  
  loading.value = true;
  
  try {
    await guardarReserva(reserva);
    
    showSnackbar.value = true;
    snackbarText.value = 'Reserva creada exitosamente';
    snackbarColor.value = 'success';
    
    // Redirigir al listado después de un breve retraso
    setTimeout(() => {
      router.push('/reservas');
    }, 1500);
  } catch (error: any) {
    console.error('Error al crear reserva:', error);
    
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
      snackbarText.value = 'Error al crear la reserva. Intente nuevamente.';
    }
  } finally {
    loading.value = false;
  }
};
</script>