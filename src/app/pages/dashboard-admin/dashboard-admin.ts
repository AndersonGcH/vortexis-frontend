import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardAdmin } from '../../models/dashboard-admin';

// 📊 PASO 3: IMPORTACIÓN Y REGISTRO DE CHART.JS
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdminComponent implements OnInit {

  dashboard?: DashboardAdmin;
  
  // Guardamos la referencia para poder destruir/limpiar el gráfico si fuera necesario
  instanciaGrafico: any = null;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardService.obtenerDashboardAdmin().subscribe({
      next: (response) => {
        // 🚀 PASO 6: ASIGNACIÓN Y RENDERIZADO SECUENCIAL
        this.dashboard = response;
        this.cdr.detectChanges(); // Fuerza el renderizado del HTML para que exista el <canvas>

        setTimeout(() => {
          this.crearGrafico(); // Dibuja el gráfico una vez el DOM está listo
        });
      },
      error: (error) => {
        console.error('Error al cargar las métricas del dashboard:', error);
      }
    });
  }

  // 📈 PASO 5: MÉTODO PARA CONSTRUIR EL GRÁFICO DE BARRAS
  crearGrafico() {
    // Si por alguna razón ya existía un gráfico (ej. al refrescar datos), lo destruimos antes
    if (this.instanciaGrafico) {
      this.instanciaGrafico.destroy();
    }

    this.instanciaGrafico = new Chart(
      'graficoProductos',
      {
        type: 'bar',
        data: {
          labels: this.dashboard!.topProductos.map(p => p.producto),
          datasets: [
            {
              label: 'Cantidad Vendida',
              data: this.dashboard!.topProductos.map(p => p.cantidadVendida),
              backgroundColor: '#0d6efd', // Azul corporativo de Vortexis
              borderColor: '#0b5ed7',
              borderWidth: 1,
              borderRadius: 4 // Suaviza las esquinas de las barras
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );
  }
}