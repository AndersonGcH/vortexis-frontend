import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MovimientoInventario } from '../../models/movimiento-inventario';
import { MovimientoRequest } from '../../models/movimiento-request';
@Injectable({
  providedIn: 'root'
})
export class MovimientoInventarioService {

  private apiUrl =
    'http://localhost:8080/api/movimientos';

  constructor(
    private http: HttpClient
  ) {}

  listar(): Observable<MovimientoInventario[]> {

    return this.http.get<MovimientoInventario[]>(
      this.apiUrl
    );

  }

  registrar(
  movimiento: MovimientoRequest
) {

  return this.http.post(
    this.apiUrl,
    movimiento
  );

}

}