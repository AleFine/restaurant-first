<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <h1 class="text-h4 font-weight-bold">
            <v-icon size="x-large" class="mr-2">mdi-account-group</v-icon>
            Listado de Comensales
          </h1>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            prepend-icon="mdi-account-plus"
            :to="'/comensales/nuevo'"
            variant="elevated"
          >
            Nuevo Comensal
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <comensales-filtros 
      v-model:filtros="filtros"
      @update:filtros="actualizarFiltros" 
    />
    
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-end">
        <!-- Ordenamiento -->
        <comensales-ordenamiento 
          v-model:sortBy="sortBy"
          v-model:sortDir="sortDir"
          @update:ordenamiento="buscarComensales"
        />
      </v-col>
    </v-row>
    
    <!-- Estado de carga y errores -->
    <v-row v-if="comensalesState.loading">
      <v-col cols="12">
        <v-sheet class="pa-6 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <div class="mt-4">Cargando comensales...</div>
        </v-sheet>
      </v-col>
    </v-row>
    
    <v-row v-else-if="comensalesState.error">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          closable
        >
          {{ comensalesState.error }}
        </v-alert>
      </v-col>
    </v-row>
    
    <v-row v-else-if="comensalesState.comensales.length === 0">
      <v-col cols="12">
        <v-sheet class="pa-6 text-center">
          <v-icon size="x-large" color="info" class="mb-2">mdi-information</v-icon>
          <div>No hay comensales registrados que coincidan con los criterios de búsqueda.</div>
        </v-sheet>
      </v-col>
    </v-row>
    
    <v-row v-else>
      <v-col cols="12">
        <!-- Tabla de comensales -->
        <comensales-tabla 
          :comensales="comensalesState.comensales"
          :loading="comensalesState.loading"
          :items-per-page="perPage"
          @editar="(editarComensal)"
          @eliminar="(confirmarEliminacion)"
        />
        
        <!-- Paginación -->
        <comensales-paginacion
          v-if="comensalesState.comensales.length > 0"
          :pagination="pagination"
          v-model:perPage="perPage"
          @cambiar-pagina="cambiarPagina"
        />
      </v-col>
    </v-row>
    
    <!-- Modal de confirmación para eliminar -->
    <confirmar-eliminacion-modal
      v-model:modelValue="showDeleteModal"
      :comensal="comensalAEliminar"
      @confirmar="() => handleEliminarComensal(comensalAEliminar?.id_comensal)"
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

// Snackbar state
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Computed wrappers for filtros to satisfy v-model requirements
const sortBy = computed({ 
  get: () => filtros.value.sort_by!, 
  set: v => { filtros.value.sort_by = v; buscarComensales(); } 
});

const sortDir = computed({ 
  get: () => filtros.value.sort_dir!, 
  set: v => { filtros.value.sort_dir = v; buscarComensales(); } 
});

const perPage = computed({ 
  get: () => filtros.value.per_page!, 
  set: v => { filtros.value.per_page = v; buscarComensales(); } 
});

const editarComensal = (comensal: Comensal) => {
  router.push(`/comensales/editar/${comensal.id_comensal}`);
};

// Override eliminarComensal to show success message
const handleEliminarComensal = async (id?: number) => {
  if (!id) return;
  
  try {
    await eliminarComensal(id);
    showSnackbar.value = true;
    snackbarText.value = 'Comensal eliminado exitosamente';
    snackbarColor.value = 'success';
    cerrarModal();
  } catch (error) {
    showSnackbar.value = true;
    snackbarText.value = 'Error al eliminar el comensal';
    snackbarColor.value = 'error';
    console.error('Error al eliminar comensal:', error);
  }
};

onMounted(() => {
  cargarComensales();
});
</script>