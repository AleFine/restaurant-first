<!-- src/components/common/FilterPanel.vue -->
<template>
    <v-card v-if="modelValue" class="mb-4">
      <v-card-text class="pt-6">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              :model-value="filters.date"
              label="Fecha"
              type="date"
              prepend-inner-icon="mdi-calendar"
              @update:model-value="updateFilter('date', $event)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              :model-value="filters.searchTerm"
              label="Buscar"
              placeholder="Nombre, mesa, teléfono..."
              prepend-inner-icon="mdi-magnify"
              @update:model-value="updateFilter('searchTerm', $event)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-select
              :model-value="itemsPerPage"
              label="Por página"
              :items="[5, 10, 20, 50]"
              @update:model-value="$emit('update:itemsPerPage', $event)"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="2" class="d-flex align-center">
            <v-btn variant="text" @click="$emit('clear')">
              <v-icon size="small" class="mr-2">mdi-close</v-icon>
              Limpiar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import type { FilterOptions } from '../../types/index';
  
  export default defineComponent({
    name: 'FilterPanel',
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      filters: {
        type: Object as () => FilterOptions,
        required: true
      },
      itemsPerPage: {
        type: Number,
        default: 10
      }
    },
    emits: ['update:modelValue', 'update:filters', 'update:itemsPerPage', 'clear'],
    setup(props, { emit }) {
      const updateFilter = (key: keyof FilterOptions, value: any) => {
        const updatedFilters = { ...props.filters, [key]: value };
        emit('update:filters', updatedFilters);
      };
  
      return {
        updateFilter
      };
    }
  });
  </script>