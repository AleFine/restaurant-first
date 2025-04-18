import { ref, reactive } from 'vue';
import { fetchComensales, deleteComensal, createComensal, updateComensal as apiUpdateComensal, fetchComensal as apiFetchComensal, type ComensalParams } from '../api/comensales';
import type { Comensal } from '../types/Comensal';

export const useComensalesStore = () => {
  // Estado
  const comensalesState = reactive({
    comensales: [] as Comensal[],
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
  const filtros = ref<Required<ComensalParams>>({
    page: 1,
    per_page: 15,
    nombre: '',
    correo: '',
    telefono: '',
    sort_by: 'nombre',
    sort_dir: 'asc'
  });

  // Función para cargar comensales con todos los parámetros
  const cargarComensales = async (page = 1) => {
    comensalesState.loading = true;
    comensalesState.error = null;
    
    // Actualizar la página en los filtros
    filtros.value.page = page;
    
    try {
      const response = await fetchComensales(filtros.value);
      
      // Comprobar si la respuesta tiene la estructura esperada
      if (response.data && response.data.data) {
        // Asignar los datos recibidos
        comensalesState.comensales = response.data.data;
        
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
        comensalesState.error = 'Formato de respuesta inesperado del servidor.';
      }
    } catch (err: any) {
      comensalesState.error = 'Error al cargar los comensales: ' + (err.response?.data?.message || err.message);
    } finally {
      comensalesState.loading = false;
    }
  };

  // Cambiar de página
  const cambiarPagina = (page: number) => {
    if (page < 1 || page > pagination.value.last_page) return;
    buscarComensales(page);
  };

  // Búsqueda con todos los filtros
  const buscarComensales = (page = filtros.value.page) => {
    cargarComensales(page || 1);
  };

  // Actualizar filtros
  const actualizarFiltros = (newFiltros: ComensalParams) => {
    filtros.value = { ...newFiltros } as Required<ComensalParams>;
    buscarComensales(1); // Reset a página 1 con cada búsqueda
  };

  const actualizarPerPage = (perPage: number) => {
    filtros.value.per_page = perPage;
    buscarComensales(1);
  };

  // Eliminar comensal
  const eliminarComensal = async (id?: number) => {
    if (!id) return;
    
    try {
      await deleteComensal(id);
      
      // Si eliminamos el último elemento de la página actual y no es la primera página
      if (comensalesState.comensales.length === 1 && pagination.value.current_page > 1) {
        // Volver a la página anterior
        await buscarComensales(pagination.value.current_page - 1);
      } else {
        // Mantener en la página actual
        await buscarComensales(pagination.value.current_page);
      }
    } catch (err: any) {
      comensalesState.error = 'Error al eliminar el comensal: ' + (err.response?.data?.message || err.message);
    }
  };

  // Crear nuevo comensal
  const guardarComensal = async (nuevo: Comensal) => {
    // Omitir loading global, manejar desde componente
    return await createComensal(nuevo);
  };

  // Obtener un comensal por ID
  const obtenerComensal = async (id: number): Promise<Comensal> => {
    const response = await apiFetchComensal(id);
    // API returns { data: Comensal }
    return response.data.data;
  };

  // Actualizar un comensal por ID
  const modificarComensal = async (id: number, datos: Comensal) => {
    return await apiUpdateComensal(id, datos);
  };

  return {
    comensalesState,
    filtros,
    pagination,
    cargarComensales,
    buscarComensales,
    cambiarPagina,
    actualizarFiltros,
    actualizarPerPage,
    eliminarComensal,
    guardarComensal,
    obtenerComensal,
    modificarComensal
  };
};