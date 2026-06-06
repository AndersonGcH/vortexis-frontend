export interface ProductoRequest {
id?: number;
  nombre: string;

  sku: string;

  precio: number;

  stock: number;

  stockMinimo: number;

  descripcion: string;

  activo: boolean;

  categoriaId: number;

  proveedorId?: number;

}