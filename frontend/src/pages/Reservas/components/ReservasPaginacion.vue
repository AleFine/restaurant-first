<template>
  <div class="d-flex justify-center">
    <v-pagination
      v-model="paginaInterna"
      :length="totalPaginas"
      :total-visible="7"
      rounded="circle"
      @update:model-value="cambiarPagina"
    ></v-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  pagina: number;
  totalPaginas: number;
}>();

const emit = defineEmits<{
  'update:pagina': [pagina: number];
}>();

const paginaInterna = ref(props.pagina);

const cambiarPagina = (nuevaPagina: number) => {
  emit('update:pagina', nuevaPagina);
};

// Actualizar página interna cuando cambia el prop
watch(() => props.pagina, (nuevaPagina) => {
  paginaInterna.value = nuevaPagina;
});
</script>