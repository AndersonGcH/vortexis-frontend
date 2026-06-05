import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Categoria } from '../../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl =
    'http://localhost:8080/api/categorias';

  constructor(
    private http: HttpClient
  ) {}

  listar(): Observable<Categoria[]> {

    return this.http.get<Categoria[]>(
      this.apiUrl
    );

  }

guardar(categoria: Categoria): Observable<Categoria> { // 👈 Agrégale el : Observable<Categoria>
    return this.http.post<Categoria>( // 👈 Y agrégale el <Categoria> aquí al post
      this.apiUrl,
      categoria
    );
  }

  eliminar(
    id: number
  ) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

  actualizar(
  id: number,
  categoria: Categoria
) {

  return this.http.put(
    `${this.apiUrl}/${id}`,
    categoria
  );

}

}