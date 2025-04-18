import axios from 'axios';
import type { Mesa } from '../types/Mesa';

const API = 'http://localhost:8080/api/mesas';

export const fetchMesas = () => axios.get(API);
export const createMesa = (data: Mesa) => axios.post(API, data);
export const updateMesa = (id_mesa: number, data: Mesa) => axios.put(`${API}/${id_mesa}`, data);
export const deleteMesa = (id_mesa: number) => axios.delete(`${API}/${id_mesa}`);