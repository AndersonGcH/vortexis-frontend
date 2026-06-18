import { DetalleVentaRequest } from './detalle-venta-request';

export interface VentaRequest {

  clienteId: number;

  usuarioId: number;

  metodoPago: string;

  detalles: DetalleVentaRequest[];

}