<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">Gestión de Reservas</h1>
  
          <!-- Tarjeta de acciones -->
          <v-card class="mb-4">
            <v-card-text class="d-flex flex-wrap align-center">
              <div class="d-flex align-center">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="abrirDialogCrear"
                  class="me-2"
                >
                  Nueva Reserva
                </v-btn>
              </div>
  
              <v-spacer></v-spacer>
  
              <div class="d-flex align-center">
                <v-select
                  v-model="paginacion.porPagina"
                  :items="[5, 10, 15, 20, 25, 50]"
                  label="Por página"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="porpagina-select"
                  style="width: 120px;"
                  @update:model-value="actualizarPaginacion"
                ></v-select>
  
                <v-btn
                  icon
                  variant="text"
                  color="primary"
                  @click="cargarReservas"
                  class="ms-2"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
  
          <!-- Filtros -->
          <reservas-filtros
            :filtros="filtros"
            @aplicar-filtros="aplicarFiltros"
            @limpiar-filtros="limpiarFiltros"
          />
  
          <!-- Tabla de reservas -->
          <reservas-tabla
            :reservas="reservas"
            :cargando="cargando"
            :sort-by="store.filtros.value.sort_by"
            :sort-dir="store.filtros.value.sort_dir"
            @editar="editarReserva"
            @eliminar="confirmarEliminar"
            @ver-detalle="verDetalle"
            @cambiar-orden="actualizarOrden"
          />
  
          <!-- Paginación -->
          <reservas-paginacion
            v-if="paginacion.totalPaginas > 0"
            v-model:pagina="paginacion.pagina"
            :total-paginas="paginacion.totalPaginas"
            @update:pagina="cambiarPagina"
          />
  
          <!-- Diálogos -->
          <reservas-form
            v-model="dialogForm"
            :reserva="reservaSeleccionada"
            :modo="modoForm"
            @guardar="guardarReserva"
            @cerrar="cerrarDialogForm"
          />
  
          <reservas-detalle
            v-model="dialogDetalle"
            :reserva="reservaSeleccionada"
            @cerrar="cerrarDialogDetalle"
          />
  
          <confirmar-dialog
            v-model="dialogConfirmar"
            :mensaje="mensajeConfirmacion"
            @confirmar="eliminarReserva"
            @cancelar="cerrarDialogConfirmar"
          />
  
          <!-- Notificaciones -->
          <v-snackbar
            v-model="mostrarSnackbar"
            :color="snackbarColor"
            :timeout="3000"
          >
            {{ mensajeSnackbar }}
            <template v-slot:actions>
              <v-btn
                icon
                variant="text"
                @click="mostrarSnackbar = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useReservasStore } from './composables/useReservasStore'; // Ajusta la ruta según tu estructura
  import type { Reserva } from '../../types/Reserva'; // Ajusta la ruta según tu estructura
  import ReservasTabla from './components/ReservasTabla.vue';
  import ReservasFiltros from '../../components/ReservasFiltros.vue';
  import ReservasPaginacion from './components/ReservasPaginacion.vue';
  import ReservasForm from '../../components/ReservasForm.vue';
  import ReservasDetalle from '../../components/ReservasDetalle.vue';
  import ConfirmarDialog from '../../components/ConfirmDialog.vue';

  
  // Usar el store
  const store = useReservasStore();
  
  // Estado de la página
  const reservas = ref<Reserva[]>([]);
  const cargando = ref(false);
  
  // Estado de paginación
  const paginacion = reactive({
    pagina: 1,
    porPagina: 10,
    total: 0,
    totalPaginas: 0
  });
  
  // Filtros
  const filtros = reactive({
    fecha: '' as string,           // Siempre un string, inicializado como vacío
    id_comensal: null as number | null,
    id_mesa: null as number | null,
    personas: null as number | null
  });
  
  // Estado de diálogos
  const dialogForm = ref(false);
  const dialogDetalle = ref(false);
  const dialogConfirmar = ref(false);
  const modoForm = ref<'crear' | 'editar'>('crear');
  const reservaSeleccionada = ref<Reserva | null>(null);
  const mensajeConfirmacion = ref('');
  
  // Estado de notificaciones
  const mostrarSnackbar = ref(false);
  const mensajeSnackbar = ref('');
  const snackbarColor = ref('success');
  
  // Métodos de carga de datos
  const cargarReservas = async () => {
    cargando.value = true;
    try {
      await store.cargarReservas(paginacion.pagina);
      reservas.value = store.reservasState.reservas;
      paginacion.total = store.pagination.value.total;
      paginacion.totalPaginas = store.pagination.value.last_page;
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      mostrarNotificacion('Error al cargar reservas', 'error');
    } finally {
      cargando.value = false;
    }
  };
  
  // Métodos de paginación
  const cambiarPagina = (nuevaPagina: number) => {
    paginacion.pagina = nuevaPagina;
    cargarReservas();
  };
  
  const actualizarPaginacion = () => {
    paginacion.pagina = 1;
    store.actualizarPerPage(paginacion.porPagina);
    cargarReservas();
  };
  
  const actualizarOrden = (campo: string, direccion: 'asc' | 'desc') => {
    store.actualizarFiltros({
      ...store.filtros.value,    // Usa .value para acceder al objeto interno
      sort_by: campo,
      sort_dir: direccion
    });
    cargarReservas();
  };
  // Métodos de filtrado
  const aplicarFiltros = (nuevosFiltros: any) => {
    Object.assign(filtros, nuevosFiltros);
    store.actualizarFiltros({
      ...store.filtros.value,
      page: 1,
      per_page: paginacion.porPagina,
      sort_by: 'fecha',
      sort_dir: 'desc',
      fecha: filtros.fecha || undefined,
      id_comensal: filtros.id_comensal ?? undefined,
      id_mesa: filtros.id_mesa ?? undefined,
      personas: filtros.personas ?? undefined
    });
    cargarReservas();
  };
  
  const limpiarFiltros = () => {
  filtros.fecha = '';            // String vacío, no undefined
  filtros.id_comensal = null;
  filtros.id_mesa = null;
  filtros.personas = null;
  store.actualizarFiltros({
    page: 1,
    per_page: paginacion.porPagina,
    sort_by: 'fecha',
    sort_dir: 'desc',
    fecha: undefined,           // El store puede aceptar undefined
    id_comensal: undefined,
    id_mesa: undefined,
    personas: undefined
  });
  cargarReservas();
};
  
  // Métodos de CRUD
  const abrirDialogCrear = () => {
    reservaSeleccionada.value = {
      id_reserva: 0,
      fecha: '',
      hora: '',
      numero_de_personas: 1,
      id_comensal: 0,
      id_mesa: 0,
      comensal: undefined,
      mesa: undefined
    };
    modoForm.value = 'crear';
    dialogForm.value = true;
  };
  
  const editarReserva = (reserva: Reserva) => {
    reservaSeleccionada.value = { ...reserva };
    modoForm.value = 'editar';
    dialogForm.value = true;
  };
  
  const verDetalle = (reserva: Reserva) => {
    reservaSeleccionada.value = { ...reserva };
    dialogDetalle.value = true;
  };
  
  const confirmarEliminar = (reserva: Reserva) => {
    reservaSeleccionada.value = { ...reserva };
    mensajeConfirmacion.value = `¿Está seguro que desea eliminar la reserva del ${reserva.fecha} a las ${reserva.hora} a nombre de ${reserva.comensal?.nombre || 'cliente'}?`;
    dialogConfirmar.value = true;
  };
  
  const guardarReserva = async (reserva: Reserva) => {
    try {
      if (modoForm.value === 'crear') {
        await store.guardarReserva(reserva);
        mostrarNotificacion('Reserva creada correctamente', 'success');
      } else {
        await store.modificarReserva(reserva.id_reserva!, reserva);
        mostrarNotificacion('Reserva actualizada correctamente', 'success');
      }
      cerrarDialogForm();
      cargarReservas();
    } catch (error: any) {
      console.error('Error al guardar reserva:', error);
      mostrarNotificacion(
        error.response?.data?.message || 'Error al guardar reserva', 
        'error'
      );
    }
  };
  
  const eliminarReserva = async () => {
    if (!reservaSeleccionada.value) return;
    
    try {
      await store.eliminarReserva(reservaSeleccionada.value.id_reserva);
      mostrarNotificacion('Reserva eliminada correctamente', 'success');
      cerrarDialogConfirmar();
      cargarReservas();
    } catch (error: any) {
      console.error('Error al eliminar reserva:', error);
      mostrarNotificacion(
        error.response?.data?.message || 'Error al eliminar reserva', 
        'error'
      );
    }
  };
  
  // Métodos para cerrar diálogos
  const cerrarDialogForm = () => {
    dialogForm.value = false;
    reservaSeleccionada.value = null;
  };
  
  const cerrarDialogDetalle = () => {
    dialogDetalle.value = false;
    reservaSeleccionada.value = null;
  };
  
  const cerrarDialogConfirmar = () => {
    dialogConfirmar.value = false;
    reservaSeleccionada.value = null;
  };
  
  // Método para mostrar notificaciones
  const mostrarNotificacion = (mensaje: string, color: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    mensajeSnackbar.value = mensaje;
    snackbarColor.value = color;
    mostrarSnackbar.value = true;
  };
  
  // Inicialización
  onMounted(() => {
    cargarReservas();
  });
  </script>
  
  <style scoped>
  .porpagina-select :deep(.v-field__input) {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  </style>
