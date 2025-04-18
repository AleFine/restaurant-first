<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Listado de Comensales</h1>
    
    <!-- Filtros -->
    <comensales-filtros 
      v-model:filtros="filtros"
      @update:filtros="actualizarFiltros" 
    />
    
    <div class="mb-4 flex justify-between items-center">
      <router-link to="/comensales/nuevo" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
        Nuevo Comensal
      </router-link>
      
      <!-- Ordenamiento -->
      <comensales-ordenamiento 
        v-model:sortBy="sortBy"
        v-model:sortDir="sortDir"
        @update:ordenamiento="buscarComensales"
      />
    </div>
    
    <div v-if="comensalesState.loading" class="text-center py-4">
      <p>Cargando comensales...</p>
    </div>
    
    <div v-else-if="comensalesState.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ comensalesState.error }}</p>
    </div>
    
    <div v-else-if="comensalesState.comensales.length === 0" class="text-center py-4">
      <p>No hay comensales registrados que coincidan con los criterios de búsqueda.</p>
    </div>
    
    <comensales-tabla 
      v-else
      :comensales="comensalesState.comensales"
      @editar="editarComensal"
      @eliminar="confirmarEliminacion"
    />
    
    <!-- Paginación -->
    <comensales-paginacion
      v-if="comensalesState.comensales.length > 0"
      :pagination="pagination"
      v-model:perPage="perPage"
      @cambiar-pagina="cambiarPagina"
    />
    
    <!-- Modal de confirmación para eliminar -->
    <confirmar-eliminacion-modal
      v-if="showDeleteModal"
      :comensal="comensalAEliminar"
      @confirmar="() => eliminarComensal(comensalAEliminar?.id_comensal)"
      @cancelar="cerrarModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ComensalesFiltros from './components/ComensalesFiltros.vue';
import ComensalesOrdenamiento from './components/ComensalesOrdenamiento.vue';
import ComensalesTabla from './components/ComensalesTabla.vue';
import ComensalesPaginacion from './components/ComensalesPaginacion.vue';
import ConfirmarEliminacionModal from './modals/ConfirmarEliminacionModal.vue';
import { useComensalesStore } from '../../composables/useComensalesStore';
import { useModalState } from '../../composables/useModalState';
import type { Comensal } from '../../types/Comensal';

const router = useRouter();

const { 
  comensalesState, 
  filtros, 
  pagination, 
  cargarComensales, 
  buscarComensales, 
  cambiarPagina,
  actualizarFiltros,
  eliminarComensal
} = useComensalesStore();

const {
  showDeleteModal,
  comensalAEliminar,
  confirmarEliminacion,
  cerrarModal
} = useModalState<Comensal>();

// Computed wrappers for filtros to satisfy v-model requirements
const sortBy = computed({ get: () => filtros.value.sort_by!, set: v => { filtros.value.sort_by = v; buscarComensales(); } });
const sortDir = computed({ get: () => filtros.value.sort_dir!, set: v => { filtros.value.sort_dir = v; buscarComensales(); } });
const perPage = computed({ get: () => filtros.value.per_page!, set: v => { filtros.value.per_page = v; buscarComensales(); } });

const editarComensal = (comensal: Comensal) => {
  router.push(`/comensales/editar/${comensal.id_comensal}`);
};

onMounted(() => {
  cargarComensales();
});
</script>