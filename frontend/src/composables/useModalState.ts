import { ref, shallowRef } from 'vue';

export const useModalState = <T>() => {
  const showDeleteModal = ref(false);

  const comensalAEliminar = shallowRef<T | null>(null);

  const confirmarEliminacion = (item: T) => {
    comensalAEliminar.value = item;
    showDeleteModal.value = true;
  };

  const cerrarModal = () => {
    showDeleteModal.value = false;
    comensalAEliminar.value = null;
  };

  return {
    showDeleteModal,
    comensalAEliminar,
    confirmarEliminacion,
    cerrarModal
  };
};
