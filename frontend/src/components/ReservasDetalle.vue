<template>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-if="reserva">
        <v-card>
          <v-card-title>
            <span class="headline">Detalles de la Reserva</span>
          </v-card-title>
          <v-card-text>
            <p><strong>Fecha:</strong> {{ reserva.fecha }}</p>
            <p><strong>Hora:</strong> {{ reserva.hora }}</p>
            <p><strong>Número de Personas:</strong> {{ reserva.numero_de_personas }}</p>
            <p><strong>Comensal:</strong> {{ reserva.comensal?.nombre || 'N/A' }}</p>
            <p><strong>Mesa:</strong> {{ reserva.mesa?.numero_mesa || 'N/A' }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cerrar">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </template>
  
  
  <script setup lang="ts">
    import { ref, watch } from 'vue';
    import type { Reserva } from '../types/Reserva';
    
    const props = defineProps<{
        modelValue: boolean;
        reserva: Reserva | null;
    }>();
    
    const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean): void;
        (e: 'cerrar'): void;
    }>();
    
    const dialog = ref(props.modelValue);
    
    watch(() => props.modelValue, (newVal) => {
        dialog.value = newVal;
    });
    
    const cerrar = () => {
        emit('cerrar');
    };
  </script>