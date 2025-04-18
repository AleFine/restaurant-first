import { ref, reactive } from 'vue';
import { fetchMesas, deleteMesa, createMesa, updateMesa as apiUpdateMesa, fetchMesa as apiFetchMesa, type MesaParams } from '../../../api/mesas';
import type { Mesa } from '../../../types/Mesa';

export const useMesasStore = () => {
  // Estado
  const mesasState = reactive({
    mesas: [] as Mesa[],
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
  const filtros = ref<Required<MesaParams>>({
    page: 1,
    per_page: 15,
    numero_mesa: undefined as any,
    capacidad: undefined as any,
    ubicacion: undefined as any,
    sort_by: 'numero_mesa',
    sort_dir: 'asc'
  });

  // Función para cargar mesas con todos los parámetros
  const cargarMesas = async (page = 1) => {
    mesasState.loading = true;
    mesasState.error = null;
    
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
    if (filtros.value.numero_mesa) {
      cleanParams['numero_mesa'] = filtros.value.numero_mesa;
    }
    if (filtros.value.capacidad) {
      cleanParams['capacidad'] = filtros.value.capacidad;
    }
    if (filtros.value.ubicacion) {
      cleanParams['ubicacion'] = filtros.value.ubicacion;
    }
    
    try {
      const response = await fetchMesas(cleanParams);
      
      
      // Comprobar si la respuesta tiene la estructura esperada
      if (response.data && response.data.data) {
        // Asignar los datos recibidos
        mesasState.mesas = response.data.data;
        
        // Actualizar la información de paginación
        pagination.value = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          from: response.data.meta.from || 0,
          to: response.data.meta.to || 0,
          total: response.data.meta.total
        };
      } else {
        mesasState.error = 'Formato de respuesta inesperado del servidor.';
      }
    } catch (err: any) {
      console.error('Error al cargar mesas:', err);
      mesasState.error = 'Error al cargar las mesas: ' + (err.response?.data?.message || err.message);
    } finally {
      mesasState.loading = false;

    }
  };

  // Cambiar de página
  const cambiarPagina = (page: number) => {
    if (page < 1 || page > pagination.value.last_page) return;
    buscarMesas(page);
  };

  // Búsqueda con todos los filtros
  const buscarMesas = (page = filtros.value.page) => {
    cargarMesas(page || 1);
  };

  // Actualizar filtros
  const actualizarFiltros = (newFiltros: MesaParams) => {
    filtros.value = { ...newFiltros } as Required<MesaParams>;
    buscarMesas(1); // Reset a página 1 con cada búsqueda
  };

  const actualizarPerPage = (perPage: number) => {
    filtros.value.per_page = perPage;
    buscarMesas(1);
  };

  // Eliminar mesa
  const eliminarMesa = async (id?: number) => {
    if (!id) return;
    
    try {
      await deleteMesa(id);
      
      // Si eliminamos el último elemento de la página actual y no es la primera página
      if (mesasState.mesas.length === 1 && pagination.value.current_page > 1) {
        // Volver a la página anterior
        await buscarMesas(pagination.value.current_page - 1);
      } else {
        // Mantener en la página actual
        await buscarMesas(pagination.value.current_page);
      }
    } catch (err: any) {
      mesasState.error = 'Error al eliminar la mesa: ' + (err.response?.data?.message || err.message);
    }
  };

  // Crear nueva mesa
  const guardarMesa = async (nueva: Mesa) => {
    // Omitir loading global, manejar desde componente
    return await createMesa(nueva);
  };

  // Obtener una mesa por ID
  const obtenerMesa = async (id: number): Promise<Mesa> => {
    const response = await apiFetchMesa(id);
    // API returns { data: Mesa }
    return response.data.data;
  };

  // Actualizar una mesa por ID
  const modificarMesa = async (id: number, datos: Mesa) => {
    return await apiUpdateMesa(id, datos);
  };

  return {
    mesasState,
    filtros,
    pagination,
    cargarMesas,
    buscarMesas,
    cambiarPagina,
    actualizarFiltros,
    actualizarPerPage,
    eliminarMesa,
    guardarMesa,
    obtenerMesa,
    modificarMesa
  };
};