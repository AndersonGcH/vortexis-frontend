export interface MovimientoInventario {

  id: number;

  tipo: string;

  cantidad: number;

  motivo: string;

  fecha: string;

  producto: {

    id: number;

    nombre: string;

  };

  usuario: {

    id: number;

    nombre: string;

  };

}