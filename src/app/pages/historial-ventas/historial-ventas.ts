import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ⚡ Necesario para los inputs de búsqueda
import { VentaService } from '../../core/services/venta.service';
import { Venta } from '../../models/venta';
import { NgxPaginationModule } from 'ngx-pagination'; // ⚡ Importación de la paginación

// 📦 PASO 5: IMPORTACIÓN DE FILE-SAVER PARA MANEJO DE DESCARGAS BINARIAS
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule], // ⚡ Agregados módulos de control
  templateUrl: './historial-ventas.html',
  styleUrls: ['./historial-ventas.css']
})
export class HistorialVentas implements OnInit {

  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = []; // ⚡ Lista espejo para no perder los datos originales al buscar
  
  // --- CONTROL DE UI (Buscador y Paginación) ---
  textoBuscar: string = '';
  metodoSeleccionado: string = '';
  paginaActual: number = 1;

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
        this.aplicarFiltros(); // ⚡ Inicializa la lista filtrada con los datos frescos
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar historial:', err)
    });
  }

  aplicarFiltros(): void {
    this.paginaActual = 1; // Resetea a la primera página tras filtrar
    const query = this.textoBuscar.toLowerCase().trim();

    this.ventasFiltradas = this.ventas.filter(venta => {
      
      // 1. Validar coincidencia por texto (ID, Cliente o Vendedor Encargado)
      const coincideTexto = !query ? true : (
        // Filtrar por ID de la venta
        venta.id?.toString().includes(query) ||
        
        // Filtrar por Cliente (si no hay cliente, asume 'público general')
        (venta.cliente?.nombres ? venta.cliente.nombres.toLowerCase().includes(query) : 'público general'.includes(query)) ||
        
        // Filtrar por Vendedor Encargado (mapeado exactamente de venta.usuario.nombre)
        (venta.usuario?.nombre && venta.usuario.nombre.toLowerCase().includes(query))
      );

      // 2. Validar coincidencia por método de pago
      const coincideMetodo = !this.metodoSeleccionado ? true : 
        venta.metodoPago === this.metodoSeleccionado;

      return coincideTexto && coincideMetodo;
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