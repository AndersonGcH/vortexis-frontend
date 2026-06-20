import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../core/services/venta.service';
import { Venta } from '../../models/venta';

// 📦 PASO 5: IMPORTACIÓN DE FILE-SAVER PARA MANEJO DE DESCARGAS BINARIAS
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-ventas.html',
  styleUrls: ['./historial-ventas.css']
})
export class HistorialVentas implements OnInit {

  ventas: Venta[] = [];
  
  // --- CONTROL EN MEMORIA PARA DETALLES ---
  ventaSeleccionada: Venta | null = null;

  constructor(
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  // Carga inicial del historial desde la API de Vortexis
  cargarVentas(): void {
    this.ventaService.listar().subscribe({
      next: (response) => {
        this.ventas = response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar historial:', err)
    });
  }

  // Selecciona la venta instantáneamente para mostrarla en el panel lateral o modal
  verDetalle(venta: Venta): void {
    this.ventaSeleccionada = venta;
  }

  // Quita la selección para cerrar la vista del recibo
  cerrarDetalle(): void {
    this.ventaSeleccionada = null;
  }

  // 📉 PASO 6: MÉTODO PARA CONECTAR EL SERVICIO CON LA DESCARGA DEL PDF
  descargarPdf(id: number): void {
    this.ventaService.descargarPdf(id).subscribe({
      next: (response: Blob) => {
        // Dispara la descarga del archivo en el navegador
        saveAs(response, `venta_${id}.pdf`);
      },
      error: (error) => {
        console.error('Error al procesar y descargar el archivo PDF:', error);
      }
    });
  }
}