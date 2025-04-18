<template>
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirmar</v-card-title>
        <v-card-text>{{ mensaje }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmar">Sí</v-btn>
          <v-btn color="red darken-1" text @click="cancelar">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{
    modelValue: boolean;
    mensaje: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'confirmar'): void;
    (e: 'cancelar'): void;
  }>();
  
  const dialog = ref(props.modelValue);
  
  watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
  });
  
  const confirmar = () => {
    emit('confirmar');
  };
  
  const cancelar = () => {
    emit('cancelar');
  };
  </script>