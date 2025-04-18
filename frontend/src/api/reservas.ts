import axios from 'axios';
import type { Reserva } from '../types/Reserva';

const API = 'http://localhost:8080/api/reservas';

export const fetchReservas = () => axios.get(API);
export const createReserva = (data: Reserva) => axios.post(API, data);
export const updateReserva = (id_reserva: number, data: Reserva) => axios.put(`${API}/${id_reserva}`, data);
export const deleteReserva = (id_reserva: number) => axios.delete(`${API}/${id_reserva}`);