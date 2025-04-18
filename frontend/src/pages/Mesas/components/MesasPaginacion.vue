<template>
  <div class="d-flex flex-column flex-sm-row justify-space-between align-center mt-4">
    <div class="text-body-2 text-grey-darken-1 mb-2 mb-sm-0">
      Mostrando {{ pagination.from }} - {{ pagination.to }} de {{ pagination.total }} mesas
    </div>
    
    <div class="d-flex align-center">
      <v-pagination
        v-model="currentPage"
        :length="pagination.last_page"
        :total-visible="5"
        density="comfortable"
        rounded
        @update:model-value="onPageChange"
      ></v-pagination>
      
      <v-select
        v-model="localPerPage"
        :items="perPageOptions"
        label="Por página"
        variant="outlined"
        density="comfortable"
        hide-details
        class="ml-4"
        style="width: 110px;"
      ></v-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue';

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

const currentPage = ref(props.pagination.current_page);
const localPerPage = ref(props.perPage);

const perPageOptions = [
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '25', value: 25 },
  { title: '50', value: 50 }
];

watch(() => props.pagination.current_page, (newPage) => {
  currentPage.value = newPage;
});

watch(() => props.perPage, (newPerPage) => {
  localPerPage.value = newPerPage;
});

watch(localPerPage, (newValue) => {
  emit('update:perPage', newValue);
});

const onPageChange = (page: number) => {
  emit('cambiar-pagina', page);
};
</script>