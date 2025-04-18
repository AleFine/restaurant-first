import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchReservas, deleteReserva } from '../api/reservas';
import { useSnackbar } from './useSnackbar';
import type { Reserva } from '../types/Reserva';
import type { PaginatedResponse } from '../types/Pagination';

export const useReservas = () => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  
  // Estado
  const reservas = ref<Reserva[]>([]);
  const reservaSeleccionada = ref<Reserva | null>(null);
  const showDeleteModal = ref(false);
  const loading = ref(false);
  const deleteLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Paginación
  const totalItems = ref(0);
  const itemsPerPage = ref(10);
  const page = ref(1);
  
  // Filtros y ordenamiento
  const filtros = reactive({
    fecha: '',
    id_comensal: null as number | null,
    id_mesa: null as number | null,
    personas: null as number | null
  });
  
  const ordenamiento = reactive({
    campo: 'fecha' as 'fecha' | 'hora' | 'numero_de_personas',
    direccion: 'desc' as 'asc' | 'desc'
  });
  
  // Cargar reservas con filtros, paginación y ordenamiento
  const loadReservas = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const params: Record<string, any> = {
        per_page: itemsPerPage.value,
        page: page.value,
        sort_by: ordenamiento.campo,
        sort_dir: ordenamiento.direccion
      };
      
      // Agregar filtros si están definidos
      if (filtros.fecha) params.fecha = filtros.fecha;
      if (filtros.id_comensal) params.id_comensal = filtros.id_comensal;
      if (filtros.id_mesa) params.id_mesa = filtros.id_mesa;
      if (filtros.personas) params.personas = filtros.personas;
      
      const response = await fetchReservas(params);
      const paginatedData = response.data as PaginatedResponse<Reserva>;
      
      reservas.value = paginatedData.data;
      totalItems.value = paginatedData.meta.total;
    } catch (err: any) {
      error.value = err.message || 'Error al cargar las reservas';
      console.error('Error al cargar reservas:', err);
      showSnackbar({
        text: 'Error al cargar las reservas',
        color: 'error'
      });
    } finally {
      loading.value = false;
    }
  };
  
  // Navegar a la página de crear reserva
  const goToCreate = () => {
    router.push({ name: 'reservas-crear' });
  };
  
  // Navegar a la página de editar reserva
  const goToEdit = (id: number) => {
    router.push({ name: 'reservas-editar', params: { id: id.toString() } });
  };
  
  // Abrir modal de confirmación para eliminar
  const confirmarEliminar = (reserva: Reserva) => {
    reservaSeleccionada.value = reserva;
    showDeleteModal.value = true;
  };
  
  // Eliminar reserva
  const eliminarReserva = async () => {
    if (!reservaSeleccionada.value?.id_reserva) return;
    
    deleteLoading.value = true;
    
    try {
      await deleteReserva(reservaSeleccionada.value.id_reserva);
      
      showSnackbar({
        text: 'Reserva eliminada correctamente',
        color: 'success'
      });
      
      // Recargar reservas después de eliminar
      await loadReservas();
    } catch (err: any) {
      console.error('Error al eliminar reserva:', err);
      showSnackbar({
        text: err.response?.data?.message || 'Error al eliminar la reserva',
        color: 'error'
      });
    } finally {
      deleteLoading.value = false;
      showDeleteModal.value = false;
      reservaSeleccionada.value = null;
    }
  };
  
  // Cambiar el tamaño de página
  const setItemsPerPage = (value: number) => {
    itemsPerPage.value = value;
    page.value = 1; // Reiniciar a primera página
  };
  
  // Ir a una página específica
  const setPage = (value: number) => {
    page.value = value;
  };
  
  // Cambiar ordenamiento
  const setOrdenamiento = (campo: 'fecha' | 'hora' | 'numero_de_personas', direccion: 'asc' | 'desc') => {
    ordenamiento.campo = campo;
    ordenamiento.direccion = direccion;
  };
  
  // Aplicar filtros
  const aplicarFiltros = (nuevosFiltros: any) => {
    Object.assign(filtros, nuevosFiltros);
    page.value = 1; // Reiniciar a primera página al filtrar
  };
  
  // Limpiar filtros
  const limpiarFiltros = () => {
    filtros.fecha = '';
    filtros.id_comensal = null;
    filtros.id_mesa = null;
    filtros.personas = null;
    page.value = 1; // Reiniciar a primera página
  };
  
  // Formatear fecha (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };
  
  // Formatear hora (HH:MM:SS -> HH:MM)
  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    
    try {
      return timeString.substring(0, 5);
    } catch (e) {
      return timeString;
    }
  };
  
  // Observar cambios en los filtros, ordenamiento y paginación para recargar datos
  watch([page, itemsPerPage, () => ordenamiento.campo, () => ordenamiento.direccion], () => {
    loadReservas();
  });
  
  watch(filtros, () => {
    loadReservas();
  }, { deep: true });
  
  // Cargar datos al montar el componente
  onMounted(() => {
    loadReservas();
  });
  
  return {
    // Estado
    reservas,
    reservaSeleccionada,
    showDeleteModal,
    loading,
    deleteLoading,
    error,
    
    // Paginación
    totalItems,
    itemsPerPage,
    page,
    
    // Filtros y ordenamiento
    filtros,
    ordenamiento,
    
    // Métodos
    loadReservas,
    goToCreate,
    goToEdit,
    confirmarEliminar,
    eliminarReserva,
    setItemsPerPage,
    setPage,
    setOrdenamiento,
    aplicarFiltros,
    limpiarFiltros,
    formatDate,
    formatTime
  };
};