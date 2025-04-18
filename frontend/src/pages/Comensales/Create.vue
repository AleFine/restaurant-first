<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Nuevo Comensal</h1>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>
    
    <form @submit.prevent="guardarComensal" class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input 
          id="nombre"
          v-model="comensal.nombre"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="mb-4">
        <label for="correo" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <input 
          id="correo"
          v-model="comensal.correo"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="mb-4">
        <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <input 
          id="telefono"
          v-model="comensal.telefono"
          type="tel"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="mb-6">
        <label for="direccion" class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
        <textarea 
          id="direccion"
          v-model="comensal.direccion"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      
      <div class="flex justify-between">
        <router-link to="/comensales" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">
          Cancelar
        </router-link>
        <button 
          type="submit" 
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          :disabled="saving"
        >
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createComensal } from '../../api/comensales';
import type { Comensal } from '../../types/Comensal';

const router = useRouter();
const saving = ref(false);
const error = ref<string | null>(null);

const comensal = ref<Comensal>({
  nombre: '',
  correo: '',
  telefono: '',
  direccion: ''
});

const guardarComensal = async () => {
  saving.value = true;
  error.value = null;
  
  try {
    await createComensal(comensal.value);
    router.push('/comensales');
  } catch (err) {
    error.value = 'Error al guardar el comensal. Por favor, intente nuevamente.';
    console.error('Error al crear comensal:', err);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>