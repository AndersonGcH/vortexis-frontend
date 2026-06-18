import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { VentaRequest } from '../../models/venta-request';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl =
    'http://localhost:8080/api/ventas';

  constructor(
    private http: HttpClient
  ) {}

  registrar(
    venta: VentaRequest
  ) {

    return this.http.post(
      this.apiUrl,
      venta
    );

  }

}