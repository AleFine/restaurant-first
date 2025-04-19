// src/composables/usePagination.ts
import { ref, computed } from 'vue';

export function usePagination(fetchItems: (page: number, itemsPerPage: number) => Promise<void>) {
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);

  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

  const setPage = async (page: number) => {
    currentPage.value = page;
    await fetchItems(page, itemsPerPage.value);
  };

  const setItemsPerPage = async (perPage: number) => {
    itemsPerPage.value = perPage;
    currentPage.value = 1;
    await fetchItems(1, perPage);
  };

  return {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    setPage,
    setItemsPerPage
  };
}