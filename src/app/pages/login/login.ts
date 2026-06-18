import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';

  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

iniciarSesion() {
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        

        localStorage.removeItem('token'); 

        this.authService.guardarToken(response.token);
        this.authService.guardarRol(response.rol);
        this.authService.guardarUsuarioId(
          response.usuarioId
        );

        if(response.rol === 'ADMIN') {
          this.router.navigate(['/dashboard-admin']);
        }
        else if(response.rol === 'VENDEDOR') {
          this.router.navigate(['/dashboard-vendedor']);
        }
        else if(response.rol === 'ALMACENERO') {
          this.router.navigate(['/dashboard-almacenero']);
        }
      },
      error: (error) => {
        alert('Correo o contraseña incorrectos');
        console.error(error);
      }
    });
  }

}