import { Categoria } from './categoria';

export interface Producto {

  id?: number;

  nombre: string;

  sku: string;

  precio: number;

  stock: number;

  stockMinimo: number;

  descripcion: string;

  activo: boolean;

  categoria?: Categoria;

}