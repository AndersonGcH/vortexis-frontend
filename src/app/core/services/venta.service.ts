import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentaRequest } from '../../models/venta-request';
import { Venta } from '../../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = 'http://localhost:8080/api/ventas';

  constructor(
    private http: HttpClient
  ) {}

  // 📝 Registrar una nueva venta en el sistema
  registrar(venta: VentaRequest) {
    return this.http.post(
      this.apiUrl,
      venta
    );
  }

  // 📋 Listar el historial de ventas completo
  listar(): Observable<Venta[]> {
    return this.http.get<Venta[]>(
      this.apiUrl
    );
  }

  // 📥 PASO 4: Descargar el comprobante PDF estilizado como un objeto binario (Blob)
  descargarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }
}