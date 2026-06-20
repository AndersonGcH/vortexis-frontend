import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NgxPaginationModule } from 'ngx-pagination'; // ⚡ Paso 2: Importación del módulo de paginación

import { MovimientoInventario } from '../../models/movimiento-inventario';
import { MovimientoInventarioService } from '../../core/services/movimiento-inventario';

@Component({
  selector: 'app-movimientos-inventario',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NgxPaginationModule // ⚡ Paso 2: Añadido a los imports
  ], 
  templateUrl: './movimientos-inventario.html',
  styleUrl: './movimientos-inventario.css'
})
export class MovimientosInventarioComponent implements OnInit {

  movimientos: MovimientoInventario[] = [];
  movimientosFiltrados: MovimientoInventario[] = [];
  textoBuscar: string = '';
  paginaActual: number = 1; // ⚡ Paso 3: Variable para controlar la página actual

  constructor(
    private movimientoService: MovimientoInventarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  cargarMovimientos() {
    this.movimientoService
      .listar()
      .subscribe({
        next: response => {
          this.movimientos = response;
          this.movimientosFiltrados = response;
          this.buscar(); 
          this.cdr.detectChanges(); 
        },
        error: error => {
          console.error(error);
        }
      });
  }

  // ⚡ Paso 4: Método buscar() con reinicio de página integrado
  buscar() {
    this.paginaActual = 1; // Resetea a la primera página al filtrar datos
    
    const texto = this.textoBuscar.toLowerCase().trim();

    if (!texto) {
      this.movimientosFiltrados = this.movimientos;
      return;
    }

    this.movimientosFiltrados = this.movimientos.filter(m =>
      m.producto.nombre.toLowerCase().includes(texto) ||
      m.usuario.nombre.toLowerCase().includes(texto) ||
      m.tipo.toLowerCase().includes(texto) ||
      (m.motivo && m.motivo.toLowerCase().includes(texto))
    );
  }
}