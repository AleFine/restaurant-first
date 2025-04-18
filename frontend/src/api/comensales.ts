import axios from 'axios';
import type { Comensal } from '../types/Comensal';

const API = 'http://localhost:8080/api/comensales';
export interface ComensalParams {
    page?: number;
    per_page?: number;
    nombre?: string;
    correo?: string;
    telefono?: string;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
}

export const fetchComensales = (params?: ComensalParams) => axios.get(API, { params });
export const createComensal = (data: Comensal) => axios.post(API, data);
export const updateComensal = (id_comensal: number, data: Comensal) => axios.put(`${API}/${id_comensal}`, data);
export const deleteComensal = (id_comensal: number) => axios.delete(`${API}/${id_comensal}`);
export const fetchComensal = (id_comensal: number) => axios.get(`${API}/${id_comensal}`);