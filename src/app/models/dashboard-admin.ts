export interface DashboardAdmin {

  cantidadVentas: number;

  totalVentas: number;

  totalProductos: number;

  productosStockBajo: number;

  topProductos: TopProducto[];

}

export interface TopProducto {

  producto: string;

  cantidadVendida: number;

}