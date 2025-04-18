<template>
  <v-container>
    <v-card class="mx-auto" max-width="800px" elevation="3">
      <v-card-title class="text-h5 bg-primary text-white py-3">
        <v-icon class="mr-2">mdi-table-plus</v-icon>
        Nueva Mesa
      </v-card-title>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mx-4 mt-4"
        closable
      >
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="handleGuardar" ref="form" v-model="isFormValid">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="mesa.numero_mesa"
                label="Número de Mesa"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'El número de mesa es requerido']"
                required
                prepend-inner-icon="mdi-table-chair"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="mesa.capacidad"
                label="Capacidad"
                type="number"
                variant="outlined"
                density="comfortable"
                :rules="[
                  v => !!v || 'La capacidad es requerida',
                  v => v > 0 || 'La capacidad debe ser mayor a 0'
                ]"
                required
                min="1"
                prepend-inner-icon="mdi-account-group"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="mesa.ubicacion"
                label="Ubicación"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-map-marker"
                hint="Ej: Interior, Terraza, Cerca de la ventana, etc."
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="secondary"
            :to="'/mesas'"
            prepend-icon="mdi-arrow-left"
          >
            Cancelar
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            variant="elevated"
            :loading="saving"
            :disabled="!isFormValid || saving"
            prepend-icon="mdi-content-save"
          >
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="3000"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMesasStore } from './composables/useMesasStore';
import type { Mesa } from '../../types/Mesa';

const router = useRouter();
const saving = ref(false);
const error = ref<string | null>(null);
const form = ref<any>(null);
const isFormValid = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Use store composable for CRUD operations
const { guardarMesa } = useMesasStore();

const mesa = ref<Mesa>({
  numero_mesa: '',
  capacidad: 4, // Valor predeterminado
  ubicacion: ''
});

const handleGuardar = async () => {
  try {
    const { valid } = await form.value.validate();

    if (!valid) return;

    saving.value = true;
    error.value = null;

    await guardarMesa(mesa.value);
    snackbarText.value = 'Mesa guardada exitosamente';
    snackbarColor.value = 'success';
    showSnackbar.value = true;

    // Redirect after a short delay to show the success message
    setTimeout(() => {
      router.push('/mesas');
    }, 1000);
  } catch (err: any) {
    error.value = 'Error al guardar la mesa. Por favor, intente nuevamente.';
    snackbarText.value = 'Error al guardar la mesa';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    console.error('Error al crear mesa:', err);
  } finally {
    saving.value = false;
  }
};
</script>