<template>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ modo === 'crear' ? 'Nueva Reserva' : 'Editar Reserva' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="reservaLocal.fecha" label="Fecha" type="date"></v-text-field>
            <v-text-field v-model="reservaLocal.hora" label="Hora" type="time"></v-text-field>
            <v-text-field 
              v-model="reservaLocal.numero_de_personas" 
              label="Número de Personas" 
              type="number" 
              min="1"
            ></v-text-field>
            <v-text-field 
              v-model="reservaLocal.id_comensal" 
              label="ID Comensal" 
              type="number"
            ></v-text-field>
            <v-text-field 
              v-model="reservaLocal.id_mesa" 
              label="ID Mesa" 
              type="number"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrar">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import type { Reserva } from '../types/Reserva';
  
  const props = defineProps<{
    modelValue: boolean;
    reserva: Reserva | null;
    modo: 'crear' | 'editar';
  }>();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'guardar', reserva: Reserva): void;
    (e: 'cerrar'): void;
  }>();
  
  const dialog = ref(props.modelValue);
  const reservaLocal = ref<Reserva>({ ...props.reserva } as Reserva);
  
  watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
  });
  
  watch(() => props.reserva, (newVal) => {
    reservaLocal.value = { ...newVal } as Reserva;
  });
  
  const guardar = () => {
    emit('guardar', reservaLocal.value);
  };
  
  const cerrar = () => {
    emit('cerrar');
  };
  </script>