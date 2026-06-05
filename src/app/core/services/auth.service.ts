import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../../models/login-request';
import { LoginResponse } from '../../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =
    'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }

  guardarToken(
    token: string
  ) {

    localStorage.setItem(
      'token',
      token
    );
  }

  guardarRol(
    rol: string
  ) {

    localStorage.setItem(
      'rol',
      rol
    );
  }

  esAdmin(): boolean {
  return this.obtenerRol() === 'ADMIN';
}

esVendedor(): boolean {
  return this.obtenerRol() === 'VENDEDOR'; 
}

esAlmacenero(): boolean {
  return this.obtenerRol() === 'ALMACENERO'; 
}

  obtenerToken() {

    return localStorage.getItem(
      'token'
    );
  }

  obtenerRol() {

    return localStorage.getItem(
      'rol'
    );
  }

  logout() {

    localStorage.clear();

  }
}
