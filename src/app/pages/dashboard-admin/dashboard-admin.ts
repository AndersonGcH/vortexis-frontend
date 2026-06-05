import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardAdmin } from '../../models/dashboard-admin';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdminComponent implements OnInit {

  dashboard?: DashboardAdmin;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardService.obtenerDashboardAdmin().subscribe({
      next: (response) => {
        this.dashboard = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar las métricas del dashboard:', error);
      }
    });
  }
}