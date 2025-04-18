<template>
  <v-container>
    <v-card class="mx-auto" max-width="800px" elevation="3">
      <v-card-title class="text-h5 bg-primary text-white py-3">
        <v-icon class="mr-2">mdi-account-plus</v-icon>
        Nuevo Comensal
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
                v-model="comensal.nombre"
                label="Nombre"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'El nombre es requerido']"
                required
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="comensal.correo"
                label="Correo electrónico"
                variant="outlined"
                density="comfortable"
                :rules="[
                  v => !!v || 'El correo es requerido',
                  v => /.+@.+\..+/.test(v) || 'El correo debe ser válido'
                ]"
                required
                prepend-inner-icon="mdi-email"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="comensal.telefono"
                label="Teléfono"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-phone"
                hint="Formato: +XX XXX XXX XXXX"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="comensal.direccion"
                label="Dirección"
                variant="outlined"
                rows="3"
                auto-grow
                prepend-inner-icon="mdi-map-marker"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="secondary"
            :to="'/comensales'"
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
import { useComensalesStore } from './composables/useComensalesStore';
import type { Comensal } from '../../types/Comensal';

const router = useRouter();
const saving = ref(false);
const error = ref<string | null>(null);
const form = ref<any>(null);
const isFormValid = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Use store composable for CRUD operations
const { guardarComensal } = useComensalesStore();

const comensal = ref<Comensal>({
  nombre: '',
  correo: '',
  telefono: '',
  direccion: ''
});

const handleGuardar = async () => {
  try {
    const { valid } = await form.value.validate();

    if (!valid) return;

    saving.value = true;
    error.value = null;

    await guardarComensal(comensal.value);
    snackbarText.value = 'Comensal guardado exitosamente';
    snackbarColor.value = 'success';
    showSnackbar.value = true;

    // Redirect after a short delay to show the success message
    setTimeout(() => {
      router.push('/comensales');
    }, 1000);
  } catch (err: any) {
    error.value = 'Error al guardar el comensal. Por favor, intente nuevamente.';
    snackbarText.value = 'Error al guardar el comensal';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    console.error('Error al crear comensal:', err);
  } finally {
    saving.value = false;
  }
};
</script>