// src/app/pages/ventas/ventas.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; 
import { NgxPaginationModule } from 'ngx-pagination'; // ⚡ Paso 1: Importar Paginación

// Servicios
import { ClienteService } from '../../core/services/cliente.service';
import { ProductoService } from '../../core/services/producto.service';
import { VentaService } from '../../core/services/venta.service';

// Modelos
import { Cliente } from '../../models/cliente';
import { Producto } from '../../models/producto';
import { VentaRequest } from '../../models/venta-request';
import { ItemCarrito } from '../../models/item-carrito';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule], // ⚡ Paso 2: Agregar al módulo
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css']
})
export class VentasComponent implements OnInit {

  // Listas de datos maestros
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = []; // ⚡ Filtro independiente para las tarjetas
  metodosPago: string[] = ['EFECTIVO', 'YAPE'];

  // Controladores de UI
  textoBuscar: string = ''; // ⚡ Input del buscador
  paginaActual: number = 1; // ⚡ Control de página

  // Estados del Carrito
  carrito: ItemCarrito[] = [];
  total = 0;

  // Modelo de datos listo para el envío
  venta: VentaRequest = {
    clienteId: 0,
    usuarioId: 0,
    metodoPago: '',
    detalles: []
  };

  constructor(
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarProductos();
    this.inicializarUsuario();
  }

  inicializarUsuario(): void {
    const idLocal = localStorage.getItem('usuarioId');
    this.venta.usuarioId = idLocal ? Number(idLocal) : 0;
  }

  cargarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (response) => {
        this.clientes = response;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: (response) => {
        this.productos = response;
        this.buscar(); // ⚡ Inicializa o refresca el filtro actual sin perder el texto tipeado
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  // ⚡ Paso 3: Método buscar interactivo
  buscar(): void {
    this.paginaActual = 1; 
    const texto = this.textoBuscar.toLowerCase().trim();

    if (!texto) {
      this.productosFiltrados = this.productos;
      return;
    }

    this.productosFiltrados = this.productos.filter(p => 
      p.nombre.toLowerCase().includes(texto) || 
      (p.sku && p.sku.toLowerCase().includes(texto))
    );
  }

  // Lógica de adición al carrito con modales estilizados
  agregarProducto(producto: Producto): void {
    if (producto.stock <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock Agotado',
        text: 'Este producto no cuenta con stock disponible.',
        confirmButtonColor: '#dc3545'
      });
      return;
    }
    const item = this.carrito.find(x => x.producto.id === producto.id);
    if (item) {
      this.aumentarCantidad(item);
    } else {
      this.carrito.push({ producto, cantidad: 1, subtotal: producto.precio });
      this.calcularTotal();
    }
  }

  aumentarCantidad(item: ItemCarrito): void {
    if (item.cantidad >= item.producto.stock) {
      Swal.fire({
        icon: 'info',
        title: 'Límite de Stock',
        text: `Stock máximo alcanzado: ${item.producto.stock} unidades.`,
        confirmButtonColor: '#0d6efd'
      });
      return;
    }
    item.cantidad++;
    item.subtotal = item.cantidad * item.producto.precio;
    this.calcularTotal();
  }

  disminuirCantidad(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      item.subtotal = item.cantidad * item.producto.precio;
    } else {
      this.eliminarItem(item);
    }
    this.calcularTotal();
  }

  eliminarItem(item: ItemCarrito): void {
    this.carrito = this.carrito.filter(x => x.producto.id !== item.producto.id);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((acum, item) => acum + item.subtotal, 0);
  }

  // --- REGISTRAR LA VENTA REAL ---
  registrarVenta(): void {
    if (this.carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito Vacío',
        text: 'Debe agregar al menos un producto al carrito.',
        confirmButtonColor: '#ffc107'
      });
      return;
    }
    if (this.venta.clienteId === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta Cliente',
        text: 'Por favor, seleccione un cliente.',
        confirmButtonColor: '#ffc107'
      });
      return;
    }
    if (this.venta.metodoPago === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Falta Método de Pago',
        text: 'Por favor, seleccione un método de pago.',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    this.inicializarUsuario();

    this.venta.detalles = this.carrito.map(item => ({
      productoId: item.producto.id!,
      cantidad: item.cantidad
    }));

    this.ventaService.registrar(this.venta).subscribe({
      next: (venta) => {
        Swal.fire({
          icon: 'success',
          title: '¡Venta realizada!',
          html: `
            <b>La venta fue registrada correctamente.</b>
            <br><br>
            <b>N° Venta:</b> ${venta.id}
            <br>
            <b>Total:</b> S/ ${this.total.toFixed(2)}
            <br><br>
            ¿Desea descargar el comprobante PDF?
          `,
          showCancelButton: true,
          confirmButtonText: '📄 Descargar PDF',
          cancelButtonText: 'Aceptar',
          confirmButtonColor: '#198754',
          cancelButtonColor: '#0d6efd',
          allowOutsideClick: false
        }).then(result => {
          if (result.isConfirmed) {
            this.ventaService
              .descargarPdf(venta.id!)
              .subscribe(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Venta-${venta.id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
              });
          }
          this.limpiarVenta();
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar la venta',
          text: error.error?.message ?? 'Ocurrió un error inesperado.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // --- LIMPIAR LA PANTALLA Y REFRESCAR STOCK ---
  limpiarVenta(): void {
    this.carrito = [];
    this.total = 0;
    this.textoBuscar = ''; // Limpia el filtro al completar
    this.venta = {
      clienteId: 0,
      usuarioId: 0,
      metodoPago: "",
      detalles: []
    };
    
    this.cargarProductos();
    this.inicializarUsuario();
    this.cdr.detectChanges(); 
  }
}