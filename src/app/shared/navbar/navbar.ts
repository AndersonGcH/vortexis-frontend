import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // 👈 Importamos RouterModule para los enlaces del menú
import { AuthService } from '../../core/services/auth.service'; // 👈 Ajusta esta ruta a tu proyecto

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 Importante añadir RouterModule aquí
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  // 🛠️ Inyectamos los servicios en el constructor
  constructor(
    public authService: AuthService, // 👈 ¡OJO! Lo ponemos "public" para poder usarlo directo en el HTML del Navbar
    private router: Router
  ) {}

  // 🚪 Método para cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}