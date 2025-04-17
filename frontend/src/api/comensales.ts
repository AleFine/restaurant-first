import axios from 'axios';
import type { Comensal } from '../types/Comensal';

const API = 'http://localhost:8000/api/comensales';

export const fetchComensales = () => axios.get(API);
export const createComensal = (data: Comensal) => axios.post(API, data);
export const updateComensal = (id_comensal: number, data: Comensal) => axios.put(`${API}/${id_comensal}`, data);
export const deleteComensal = (id_comensal: number) => axios.delete(`${API}/${id_comensal}`);