import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl =
    'http://localhost:8080/api/usuarios';

  constructor(
    private http: HttpClient
  ) {}

  listar() {

    return this.http.get<Usuario[]>(
      this.apiUrl
    );

  }

  guardar(
    usuario: any
  ) {

    return this.http.post(
      this.apiUrl,
      usuario
    );

  }

  actualizar(
    id: number,
    usuario: any
  ) {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      usuario
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