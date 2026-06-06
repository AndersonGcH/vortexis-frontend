import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Producto } from '../../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl =
    'http://localhost:8080/api/productos';

  constructor(
    private http: HttpClient
  ) {}

  listar() {

    return this.http.get<Producto[]>(
      this.apiUrl
    );

  }

  guardar(
    producto: any
  ) {

    return this.http.post(
      this.apiUrl,
      producto
    );

  }

  actualizar(
    id: number,
    producto: any
  ) {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      producto
    );

  }

  eliminar(
    id: number
  ) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}