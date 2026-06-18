import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DashboardAdmin }
from '../../models/dashboard-admin';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl =
    'http://localhost:8080/api/dashboard';

  constructor(
    private http: HttpClient
  ) {}

  obtenerDashboardAdmin() {

    return this.http.get<DashboardAdmin>(
      `${this.apiUrl}/admin`
    );

  }

  obtenerStockBajo() {

  return this.http.get<number>(
    `${this.apiUrl}/almacenero/stock-bajo`
  );

}

obtenerProductosCriticos() {

  return this.http.get<any[]>(
    `${this.apiUrl}/almacenero/productos-criticos`
  );

}


}