<template>
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Mostrando {{ pagination.from }} - {{ pagination.to }} de {{ pagination.total }} comensales
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="$emit('cambiar-pagina', pagination.current_page - 1)" 
          :disabled="pagination.current_page === 1"
          class="px-3 py-1 rounded border" 
          :class="pagination.current_page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-100'"
        >
          Anterior
        </button>
        
        <template v-for="page in paginasAMostrar" :key="page">
          <button 
            v-if="page !== '...'" 
            @click="$emit('cambiar-pagina', Number(page))" 
            class="px-3 py-1 rounded border"
            :class="page === pagination.current_page ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'"
          >
            {{ page }}
          </button>
          <span 
            v-else 
            class="px-3 py-1"
          >...</span>
        </template>
        
        <button 
          @click="$emit('cambiar-pagina', pagination.current_page + 1)" 
          :disabled="pagination.current_page === pagination.last_page"
          class="px-3 py-1 rounded border" 
          :class="pagination.current_page === pagination.last_page ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-100'"
        >
          Siguiente
        </button>
      </div>
      
      <div class="flex items-center">
        <span class="mr-2 text-sm text-gray-700">Por página:</span>
        <select 
          :value="perPage" 
          @change="updatePerPage"
          class="p-1 border rounded"
        >
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue';
  
  const props = defineProps<{
    pagination: {
      current_page: number;
      last_page: number;
      from: number;
      to: number;
      total: number;
    };
    perPage: number;
  }>();
  
  const emit = defineEmits<{
    'cambiar-pagina': [page: number];
    'update:perPage': [perPage: number];
  }>();
  
  // Cálculo de páginas a mostrar
  const paginasAMostrar = computed(() => {
    const { current_page, last_page } = props.pagination;
    const pages: (number | string)[] = [];
    
    if (last_page <= 7) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar la primera página
      pages.push(1);
      
      // Si la página actual está cerca del inicio
      if (current_page <= 4) {
        pages.push(2, 3, 4, 5, '...', last_page);
      } 
      // Si la página actual está cerca del final
      else if (current_page >= last_page - 3) {
        pages.push('...', last_page - 4, last_page - 3, last_page - 2, last_page - 1, last_page);
      } 
      // Si la página actual está en el medio
      else {
        pages.push('...', current_page - 1, current_page, current_page + 1, '...', last_page);
      }
    }
    
    return pages;
  });
  
  const updatePerPage = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('update:perPage', Number(target.value));
  };
  </script>