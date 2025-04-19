// src/services/reservaService.ts
import api from './api';
import type { Reserva } from '../types';
import { ReservaRequest } from '../requests/reservaRequest';

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
    try {
      console.log('Enviando datos al servidor:', reserva);
      const response = await api.post('/reservas', reserva);
      return response.data;
    } catch (error: any) {
      console.error('Error detallado:', error.response?.data);
      throw error;
    }
  },

  update: async (id: number, reserva: Partial<Reserva>) => {
    try {
      const request = new ReservaRequest(reserva);
      const response = await api.put(`/reservas/${id}`, request);
      return response.data;
    } catch (error: any) {
      console.error('Error detallado:', error.response?.data?.errors);
      throw error;
    }
  },

  delete: async (id: number) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  }
};