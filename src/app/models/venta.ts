import { Cliente } from './cliente';

export interface Venta {

  id: number;

  fecha: string;

  metodoPago: string;

  total: number;

  cliente: Cliente | null;

  usuario: any;

  detalles: any[];

}