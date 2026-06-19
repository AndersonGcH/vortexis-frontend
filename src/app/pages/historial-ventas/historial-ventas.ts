// src/app/pages/historial-ventas/historial-ventas.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../core/services/venta.service';
import { Venta } from '../../models/venta';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-ventas.html',
  styleUrls: ['./historial-ventas.css']
})
export class HistorialVentas implements OnInit {

  ventas: Venta[] = [];
  
  // --- PASO 1: VARIABLE DE CONTROL EN MEMORIA ---
  ventaSeleccionada: Venta | null = null;

  constructor(
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.ventaService.listar().subscribe({
      next: (response) => {
        this.ventas = response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar historial:', err)
    });
  }

  // --- PASO 2: SELECCIÓN INSTANTÁNEA ---
  verDetalle(venta: Venta): void {
    this.ventaSeleccionada = venta;
  }

  // Permite al usuario cerrar el panel del recibo
  cerrarDetalle(): void {
    this.ventaSeleccionada = null;
  }
}