<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Listado de Comensales</h1>
    
    <div class="mb-4 flex justify-between items-center">
      <router-link to="/comensales/nuevo" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
        Nuevo Comensal
      </router-link>
    </div>
    
    <div v-if="loading" class="text-center py-4">
      <p>Cargando comensales...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="comensales.length === 0" class="text-center py-4">
      <p>No hay comensales registrados.</p>
    </div>
    
    <div v-else class="overflow-x-auto">
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
                <router-link :to="`/comensales/editar/${comensal.id_comensal}`" class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm">
                  Editar
                </router-link>
                <button @click="confirmarEliminacion(comensal)" class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Confirmar eliminación</h2>
        <p class="mb-4">¿Está seguro que desea eliminar al comensal "{{ comensalAEliminar?.nombre }}"?</p>
        <div class="flex justify-end space-x-2">
          <button @click="showDeleteModal = false" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">
            Cancelar
          </button>
          <button @click="eliminarComensal" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchComensales, deleteComensal } from '../../api/comensales';
import type { Comensal } from '../../types/Comensal';

const comensales = ref<Comensal[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showDeleteModal = ref(false);
const comensalAEliminar = ref<Comensal | null>(null);

const cargarComensales = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetchComensales();
    comensales.value = response.data;
  } catch (err) {
    error.value = 'Error al cargar los comensales. Por favor, intente nuevamente.';
    console.error('Error al cargar comensales:', err);
  } finally {
    loading.value = false;
  }
};

const confirmarEliminacion = (comensal: Comensal) => {
  comensalAEliminar.value = comensal;
  showDeleteModal.value = true;
};

const eliminarComensal = async () => {
  if (!comensalAEliminar.value?.id_comensal) return;
  
  try {
    await deleteComensal(comensalAEliminar.value.id_comensal);
    showDeleteModal.value = false;
    await cargarComensales(); // Recargar la lista después de eliminar
  } catch (err) {
    error.value = 'Error al eliminar el comensal. Por favor, intente nuevamente.';
    console.error('Error al eliminar comensal:', err);
  }
};

onMounted(() => {
  cargarComensales();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>