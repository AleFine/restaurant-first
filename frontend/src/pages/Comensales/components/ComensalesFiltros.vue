<template>
    <div class="mb-4 p-4 bg-gray-50 rounded border">
      <h2 class="text-lg font-semibold mb-2">Filtros</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input 
            :value="filtros.nombre" 
            @input="onInput($event, 'nombre')" 
            type="text" 
            placeholder="Buscar por nombre" 
            class="w-full p-2 border rounded"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
          <input 
            :value="filtros.correo" 
            @input="onInput($event, 'correo')" 
            type="text" 
            placeholder="Buscar por correo" 
            class="w-full p-2 border rounded"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input 
            :value="filtros.telefono" 
            @input="onInput($event, 'telefono')" 
            type="text" 
            placeholder="Buscar por teléfono" 
            class="w-full p-2 border rounded"
          >
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import { useDebounce } from '../../../composables/useDebounce';
  import type { ComensalParams } from '../../../api/comensales';
  
  const props = defineProps<{
    filtros: ComensalParams
  }>();
  
  const emit = defineEmits<{
    'update:filtros': [filtros: ComensalParams]
  }>();
  
  const { debounce } = useDebounce();
  
  const onInput = (event: Event, field: keyof ComensalParams) => {
    const target = event.target as HTMLInputElement;
    const newFiltros = { ...props.filtros };
    newFiltros[field] = target.value as any;
    
    debounce(() => {
      emit('update:filtros', newFiltros);
    }, 300);
  };
  </script>