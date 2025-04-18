<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <h1 class="text-h4 font-weight-bold">
            <v-icon size="x-large" class="mr-2">mdi-table-furniture</v-icon>
            Listado de Mesas
          </h1>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            prepend-icon="mdi-plus"
            :to="'/mesas/nuevo'"
            variant="elevated"
          >
            Nueva Mesa
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <mesas-filtros 
      v-model:filtros="filtros"
      @update:filtros="actualizarFiltros" 
    />
    
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-end">
        <!-- Ordenamiento -->
        <mesas-ordenamiento 
          v-model:sortBy="sortBy"
          v-model:sortDir="sortDir"
          @update:ordenamiento="buscarMesas"
        />
      </v-col>
    </v-row>
    
    <!-- Estado de carga y errores -->
    <v-row v-if="mesasState.loading">
      <v-col cols="12">
        <v-sheet class="pa-6 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <div class="mt-4">Cargando mesas...</div>
        </v-sheet>
      </v-col>
    </v-row>
    
    <v-row v-else-if="mesasState.error">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          closable
        >
          {{ mesasState.error }}
        </v-alert>
      </v-col>
    </v-row>
    
    <v-row v-else-if="mesasState.mesas.length === 0">
      <v-col cols="12">
        <v-sheet class="pa-6 text-center">
          <v-icon size="x-large" color="info" class="mb-2">mdi-information</v-icon>
          <div>No hay mesas registradas que coincidan con los criterios de búsqueda.</div>
        </v-sheet>
      </v-col>
    </v-row>
    
    <v-row v-else>
      <v-col cols="12">
        <!-- Tabla de mesas -->
        <mesas-tabla 
          :mesas="mesasState.mesas"
          :loading="mesasState.loading"
          :items-per-page="perPage"
          @editar="editarMesa"
          @eliminar="confirmarEliminacion"
        />
        
        <!-- Paginación -->
        <mesas-paginacion
          v-if="mesasState.mesas.length > 0"
          :pagination="pagination"
          v-model:perPage="perPage"
          @cambiar-pagina="cambiarPagina"
        />
      </v-col>
    </v-row>
    
    <!-- Modal de confirmación para eliminar -->
    <confirmar-eliminacion-modal
      v-model:modelValue="showDeleteModal"
      :mesa="mesaAEliminar"
      @confirmar="() => handleEliminarMesa(mesaAEliminar?.id_mesa)"
      @cancelar="cerrarModal"
    />
    
    <!-- Snackbar para mensajes -->
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
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import MesasFiltros from './components/MesasFiltros.vue';
import MesasOrdenamiento from './components/MesasOrdenamiento.vue';
import MesasTabla from './components/MesasTabla.vue';
import MesasPaginacion from './components/MesasPaginacion.vue';
import ConfirmarEliminacionModal from './modals/ConfirmarEliminacionModal.vue';
import { useMesasStore } from './composables/useMesasStore';
import { useDeleteModalState } from '../../composables/useDeleteModalState';
import type { Mesa } from '../../types/Mesa';

const router = useRouter();

const { 
  mesasState, 
  filtros, 
  pagination, 
  cargarMesas, 
  buscarMesas, 
  cambiarPagina,
  actualizarFiltros,
  eliminarMesa
} = useMesasStore();

const {
  showDeleteModal,
  itemToDelete: mesaAEliminar,
  confirmDelete: confirmarEliminacion,
  closeModal: cerrarModal
} = useDeleteModalState<Mesa>();

// Snackbar state
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Computed wrappers for filtros to satisfy v-model requirements
const sortBy = computed({ 
  get: () => filtros.value.sort_by!, 
  set: v => { filtros.value.sort_by = v; buscarMesas(); } 
});

const sortDir = computed({ 
  get: () => filtros.value.sort_dir!, 
  set: v => { filtros.value.sort_dir = v; buscarMesas(); } 
});

const perPage = computed({ 
  get: () => filtros.value.per_page!, 
  set: v => { filtros.value.per_page = v; buscarMesas(); } 
});

const editarMesa = (mesa: Mesa) => {
  router.push(`/mesas/editar/${mesa.id_mesa}`);
};

// Override eliminarMesa to show success message
const handleEliminarMesa = async (id?: number) => {
  if (!id) return;
  
  try {
    await eliminarMesa(id);
    showSnackbar.value = true;
    snackbarText.value = 'Mesa eliminada exitosamente';
    snackbarColor.value = 'success';
    cerrarModal();
  } catch (error: any) {
    showSnackbar.value = true;
    // Capturar el mensaje específico del API para mostrarlo al usuario
    if (error.response?.status === 409) { // HTTP_CONFLICT
      snackbarText.value = error.response.data.message || 'No se puede eliminar la mesa porque tiene reservas asociadas';
    } else {
      snackbarText.value = 'Error al eliminar la mesa';
    }
    snackbarColor.value = 'error';
    console.error('Error al eliminar mesa:', error);
  }
};

onMounted(() => {
  cargarMesas();
});
</script>