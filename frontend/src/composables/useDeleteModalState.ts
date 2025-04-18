import { ref, shallowRef } from 'vue';

export const useDeleteModalState = <T>() => {
  const showDeleteModal = ref(false);
  const itemToDelete = shallowRef<T | null>(null);

  const confirmDelete = (item: T) => {
    itemToDelete.value = item;
    showDeleteModal.value = true;
  };

  const closeModal = () => {
    showDeleteModal.value = false;
    itemToDelete.value = null;
  };

  return {
    showDeleteModal,
    itemToDelete,
    confirmDelete,
    closeModal
  };
};
