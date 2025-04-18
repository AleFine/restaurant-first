import { ref, reactive } from 'vue';
import { fetchReservas, deleteReserva, createReserva, updateReserva as apiUpdateReserva, fetchReserva as apiFetchReserva, type ReservaParams } from '../../../api/reservas';
import type { Reserva } from '../../../types/Reserva';

export const useReservasStore = () => {
  // Estado
  const reservasState = reactive({
    reservas: [] as Reserva[],
    loading: true,
    error: null as string | null
  });

  // Estado de paginación
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0
  });

  // Filtros y ordenamiento
  const filtros = ref<Required<ReservaParams>>({
    page: 1,
    per_page: 15,
    fecha: undefined as any,
    id_comensal: undefined as any,
    id_mesa: undefined as any,
    personas: undefined as any,
    sort_by: 'fecha',
    sort_dir: 'desc',
    id_reserva: undefined as any
  });

  // Función para cargar reservas con todos los parámetros
  const cargarReservas = async (page = 1) => {
    reservasState.loading = true;
    reservasState.error = null;
    
    // Actualizar la página en los filtros
    filtros.value.page = page;
    
    // Crear un nuevo objeto de parámetros excluyendo los valores vacíos
    const cleanParams: Record<string, any> = {
      page: filtros.value.page,
      per_page: filtros.value.per_page,
      sort_by: filtros.value.sort_by,
      sort_dir: filtros.value.sort_dir
    };
    
    // Solo añadir filtros si tienen un valor
    if (filtros.value.fecha) {
      cleanParams['fecha'] = filtros.value.fecha;
    }
    if (filtros.value.id_comensal) {
      cleanParams['id_comensal'] = filtros.value.id_comensal;
    }
    if (filtros.value.id_mesa) {
      cleanParams['id_mesa'] = filtros.value.id_mesa;
    }
    if (filtros.value.personas) {
      cleanParams['personas'] = filtros.value.personas;
    }
    
    try {
      const response = await fetchReservas(cleanParams);
      
      // Comprobar si la respuesta tiene la estructura esperada
      if (response.data && response.data.data) {
        // Asignar los datos recibidos
        reservasState.reservas = response.data.data;
        
        // Actualizar la información de paginación
        pagination.value = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          from: response.data.meta.from || 0,
          to: response.data.meta.to || 0,
          total: response.data.meta.total
        };
      } else {
        // Si la estructura no es la esperada
        reservasState.error = 'Formato de respuesta inesperado del servidor.';
      }
    } catch (err: any) {
      reservasState.error = 'Error al cargar las reservas: ' + (err.response?.data?.message || err.message);
    } finally {
      reservasState.loading = false;
    }
  };

  // Cambiar de página
  const cambiarPagina = (page: number) => {
    if (page < 1 || page > pagination.value.last_page) return;
    buscarReservas(page);
  };

  // Búsqueda con todos los filtros
  const buscarReservas = (page = filtros.value.page) => {
    cargarReservas(page || 1);
  };

  // Actualizar filtros
  const actualizarFiltros = (newFiltros: ReservaParams) => {
    filtros.value = { ...newFiltros } as Required<ReservaParams>;
    buscarReservas(1); // Reset a página 1 con cada búsqueda
  };

  const actualizarPerPage = (perPage: number) => {
    filtros.value.per_page = perPage;
    buscarReservas(1);
  };

  // Eliminar reserva
  const eliminarReserva = async (id?: number) => {
    if (!id) return;
    
    try {
      await deleteReserva(id);
      
      // Si eliminamos el último elemento de la página actual y no es la primera página
      if (reservasState.reservas.length === 1 && pagination.value.current_page > 1) {
        // Volver a la página anterior
        await buscarReservas(pagination.value.current_page - 1);
      } else {
        // Mantener en la página actual
        await buscarReservas(pagination.value.current_page);
      }
    } catch (err: any) {
      reservasState.error = 'Error al eliminar la reserva: ' + (err.response?.data?.message || err.message);
    }
  };

  // Crear nueva reserva
  const guardarReserva = async (nueva: Reserva) => {
    // Omitir loading global, manejar desde componente
    return await createReserva(nueva);
  };

  // Obtener una reserva por ID
  const obtenerReserva = async (id: number): Promise<Reserva> => {
    const response = await apiFetchReserva(id);
    // API returns { data: Reserva }
    return response.data.data;
  };

  // Actualizar una reserva por ID
  const modificarReserva = async (id: number, datos: Reserva) => {
    return await apiUpdateReserva(id, datos);
  };

  return {
    reservasState,
    filtros,
    pagination,
    cargarReservas,
    buscarReservas,
    cambiarPagina,
    actualizarFiltros,
    actualizarPerPage,
    eliminarReserva,
    guardarReserva,
    obtenerReserva,
    modificarReserva
  };
};