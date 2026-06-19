// src/app/pages/dashboard-vendedor/dashboard-vendedor.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Servicios
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';

// Modelos
import { DashboardVendedor } from '../../models/dashboard-vendedor';

@Component({
  selector: 'app-dashboard-vendedor',
  standalone: true,
  imports: [CommonModule], // <-- Vital para usar pipes y el @for
  templateUrl: './dashboard-vendedor.html',
  styleUrls: ['./dashboard-vendedor.css']
})
export class DashboardVendedorComponent implements OnInit {

  // PASO 3 — Variables de estado
  dashboard?: DashboardVendedor;
  nombreVendedor: string = 'Vendedor';

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  // PASO 4 — Inicialización dinámica por Token/Storage
  ngOnInit(): void {
    // Obtenemos el ID real del usuario en sesión
    const usuarioId = this.authService.obtenerUsuarioId();
    
    // Opcional: Si guardaste el nombre en el login, lo recuperamos para personalizar la vista
    this.nombreVendedor = localStorage.getItem('usuarioNombre') || 'Vendedor';

    if (usuarioId) {
      this.dashboardService.obtenerDashboardVendedor(usuarioId).subscribe({
        next: (response) => {
          this.dashboard = response;
          this.cdr.detectChanges(); // Forzamos actualización de los indicadores
        },
        error: (err) => {
          console.error('Error al cargar métricas del dashboard:', err);
        }
      });
    } else {
      console.warn('No se encontró un usuarioId válido en la sesión activa.');
    }
  }
}