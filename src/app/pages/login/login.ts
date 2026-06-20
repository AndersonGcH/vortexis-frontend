import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// 🍦 IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

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
        // Limpieza y persistencia de sesión
        localStorage.removeItem('token'); 
        this.authService.guardarToken(response.token);
        this.authService.guardarRol(response.rol);
        this.authService.guardarUsuarioId(response.usuarioId);

        // Enrutamiento dinámico según el rol asignado
        if (response.rol === 'ADMIN') {
          this.router.navigate(['/dashboard-admin']);
        }

        if (response.rol === 'VENDEDOR') {
          this.router.navigate(['/vendedor/dashboard']);
        }

        if (response.rol === 'ALMACENERO') {
          this.router.navigate(['/almacenero/dashboard']);
        }
      },
      error: (error) => {
        // ❌ REEMPLAZO DEL ALERT NATIVO POR SWEETALERT2
        Swal.fire({
          icon: 'error',
          title: 'Acceso Denegado',
          text: 'El correo electrónico o la contraseña son incorrectos.',
          confirmButtonColor: '#0d6efd', // Combina con el azul de tu botón de login
          confirmButtonText: 'Entendido',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-3 shadow'
          }
        });
        
        console.error('Error de autenticación:', error);
      }
    });
  }
}