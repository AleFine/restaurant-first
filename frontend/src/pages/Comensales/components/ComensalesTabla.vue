<template>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Nombre</th>
            <th class="py-2 px-4 border-b">Correo</th>
            <th class="py-2 px-4 border-b">Teléfono</th>
            <th class="py-2 px-4 border-b">Dirección</th>
            <th class="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comensal in comensales" :key="comensal.id_comensal" class="hover:bg-gray-100">
            <td class="py-2 px-4 border-b">{{ comensal.id_comensal }}</td>
            <td class="py-2 px-4 border-b">{{ comensal.nombre }}</td>
            <td class="py-2 px-4 border-b">{{ comensal.correo }}</td>
            <td class="py-2 px-4 border-b">{{ comensal.telefono || 'No disponible' }}</td>
            <td class="py-2 px-4 border-b">{{ comensal.direccion || 'No disponible' }}</td>
            <td class="py-2 px-4 border-b">
              <div class="flex space-x-2">
                <button 
                  @click="$emit('editar', comensal)" 
                  class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
                >
                  Editar
                </button>
                <button 
                  @click="$emit('eliminar', comensal)" 
                  class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import type { Comensal } from '../../../types/Comensal';
  
  defineProps<{
    comensales: Comensal[]
  }>();
  
  defineEmits<{
    editar: [comensal: Comensal];
    eliminar: [comensal: Comensal];
  }>();
  </script>