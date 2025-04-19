import type { Reserva } from '../types';

export const ReservaTransformer = {
    toApiFormat(reserva: Partial<Reserva>): Partial<Reserva> {
      const transformed = { ...reserva };
      
      if (transformed.hora && transformed.hora.split(':').length === 2) {
        transformed.hora = `${transformed.hora}:00`;
      }
      
      return transformed;
    }
  };