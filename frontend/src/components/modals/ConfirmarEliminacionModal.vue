<template>
    <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Confirmar eliminación</h2>
        <p class="mb-4">¿Está seguro que desea eliminar al comensal "{{ comensal?.nombre }}"?</p>
        <div class="flex justify-end space-x-2">
          <button @click="$emit('cancelar')" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">
            Cancelar
          </button>
          <button @click="$emit('confirmar')" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineEmits } from 'vue';
  import type { Comensal } from '../../types/Comensal';
  
  defineProps<{
    comensal: Comensal | null;
  }>();
  
  defineEmits<{
    confirmar: [];
    cancelar: [];
  }>();
  </script>