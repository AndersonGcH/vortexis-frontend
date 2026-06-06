import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Proveedor }
from '../../models/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl =
    'http://localhost:8080/api/proveedores';

  constructor(
    private http: HttpClient
  ) {}

  listar() {

    return this.http.get<Proveedor[]>(
      this.apiUrl
    );

  }

}