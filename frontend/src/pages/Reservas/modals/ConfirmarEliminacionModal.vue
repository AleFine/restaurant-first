<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 bg-error text-white">
        <v-icon class="mr-2">mdi-delete-alert</v-icon>
        Confirmar eliminación
      </v-card-title>
      
      <v-card-text class="pt-4">
        <p class="text-body-1">
          ¿Está seguro que desea eliminar la reserva para 
          <strong>{{ reservaInfo }}</strong>?
        </p>
        <p class="text-body-2 text-grey-darken-1 mt-2">
          Esta acción no se puede deshacer.
        </p>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="text"
          @click="onCancel"
          prepend-icon="mdi-close"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="elevated"
          @click="onConfirm"
          prepend-icon="mdi-delete"
        >
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch, computed } from 'vue';
import type { Reserva } from '../../../types/Reserva';

const props = defineProps<{
  reserva: Reserva | null;
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  confirmar: [];
  cancelar: [];
  'update:modelValue': [value: boolean];
}>();

const dialog = ref(!!props.modelValue);

// Computed para mostrar información de la reserva
const reservaInfo = computed(() => {
  if (!props.reserva) return '';
  
  const fecha = new Date(props.reserva.fecha);
  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Formatear hora (asumiendo formato HH:MM:SS)
  const hora = props.reserva.hora.split(':').slice(0, 2).join(':');
  
  return `${fechaFormateada} a las ${hora}`;
});

watch(() => props.modelValue, (newValue) => {
  dialog.value = !!newValue;
});

watch(dialog, (newValue) => {
  emit('update:modelValue', newValue);
});

const onConfirm = () => {
  emit('confirmar');
};

const onCancel = () => {
  emit('cancelar');
};
</script>