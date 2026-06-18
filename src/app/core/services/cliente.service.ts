import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Cliente } from '../../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl =
    'http://localhost:8080/api/clientes';

  constructor(
    private http: HttpClient
  ) {}

  listar() {

    return this.http.get<Cliente[]>(
      this.apiUrl
    );

  }

  guardar(
    cliente: Cliente
  ) {

    return this.http.post(
      this.apiUrl,
      cliente
    );

  }

  actualizar(
    id: number,
    cliente: Cliente
  ) {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      cliente
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