// src/services/reservaService.ts
import api from './api';
import type { Reserva } from '../types';

export const reservaService = {
  getAll: async (page = 1, perPage = 10, filters = {}) => {
    const response = await api.get('/reservas', { 
      params: { page, per_page: perPage, ...filters } 
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  create: async (reserva: Omit<Reserva, 'id_reserva'>) => {
    const response = await api.post('/reservas', reserva);
    return response.data;
  },

  update: async (id: number, reserva: Partial<Reserva>) => {
    const response = await api.put(`/reservas/${id}`, reserva);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  }
};