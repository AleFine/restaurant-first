import axios from 'axios';
import type { Mesa } from '../types/Mesa';

const API = 'http://localhost:8080/api/mesas';

export interface MesaParams {
    page?: number;
    per_page?: number;
    numero_mesa?: string;
    capacidad?: number;
    ubicacion?: string;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
    id_mesa?: number;
}

export const fetchMesas = (params?: MesaParams) => axios.get(API, { params });
export const createMesa = (data: Mesa) => axios.post(API, data);
export const updateMesa = (id_mesa: number, data: Mesa) => axios.put(`${API}/${id_mesa}`, data);
export const deleteMesa = (id_mesa: number) => axios.delete(`${API}/${id_mesa}`);
export const fetchMesa = (id_mesa: number) => axios.get(`${API}/${id_mesa}`);