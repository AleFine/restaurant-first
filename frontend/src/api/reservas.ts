import axios from 'axios';
import type { Reserva } from '../types/Reserva';

const API = 'http://localhost:8080/api/reservas';

export interface ReservaParams {
    page?: number;
    per_page?: number;
    fecha?: string;
    id_comensal?: number;
    id_mesa?: number;
    personas?: number;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
    id_reserva?: number;
}

export const fetchReservas = (params?: ReservaParams) => axios.get(API, { params });
export const fetchReserva = (id_reserva: number) => axios.get(`${API}/${id_reserva}`);
export const createReserva = (data: Reserva) => axios.post(API, data);
export const updateReserva = (id_reserva: number, data: Reserva) => axios.put(`${API}/${id_reserva}`, data);
export const deleteReserva = (id_reserva: number) => axios.delete(`${API}/${id_reserva}`);