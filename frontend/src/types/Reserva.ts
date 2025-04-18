import type { Comensal } from './Comensal';
import type { Mesa } from './Mesa';

export interface Reserva {
    id_reserva?: number;
    fecha: string;
    hora: string;
    numero_de_personas: number;
    id_comensal: number;
    id_mesa: number;
    comensal?: Comensal;
    mesa?: Mesa;
}