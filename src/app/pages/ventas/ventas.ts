// src/app/pages/ventas/ventas.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Servicios
import { ClienteService } from '../../core/services/cliente.service';
import { ProductoService } from '../../core/services/producto.service';
import { VentaService } from '../../core/services/venta.service'; // <-- NUEVO

// Modelos
import { Cliente } from '../../models/cliente';
import { Producto } from '../../models/producto';
import { VentaRequest } from '../../models/venta-request';
import { ItemCarrito } from '../../models/item-carrito';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css']
})
export class VentasComponent implements OnInit {

  // Listas de datos maestros
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  metodosPago: string[] = ['EFECTIVO', 'YAPE', 'PLIN', 'TARJETA'];

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
    private ventaService: VentaService, // <-- INYECTADO
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarProductos();
    this.inicializarUsuario();
  }

  // Cargar ID del usuario logueado desde el LocalStorage de forma segura
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
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  // Lógica de adición al carrito
  agregarProducto(producto: Producto): void {
    if (producto.stock <= 0) {
      alert('Este producto no cuenta con stock disponible.');
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
      alert(`Stock máximo alcanzado: ${item.producto.stock} unidades.`);
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

  // --- PASO 6.1: REGISTRAR LA VENTA REAL ---
  registrarVenta(): void {
    if (this.carrito.length === 0) {
      alert("Debe agregar al menos un producto al carrito.");
      return;
    }
    if (this.venta.clienteId === 0) {
      alert("Por favor, seleccione un cliente.");
      return;
    }
    if (this.venta.metodoPago === "") {
      alert("Por favor, seleccione un método de pago.");
      return;
    }

    // Aseguramos el ID del usuario antes de enviar
    this.inicializarUsuario();

    // Mapeamos el Carrito al DTO que espera Spring Boot
    this.venta.detalles = this.carrito.map(item => ({
      productoId: item.producto.id!,
      cantidad: item.cantidad
    }));

    // Despachamos al Backend
    this.ventaService.registrar(this.venta).subscribe({
      next: () => {
        alert("🎉 Venta registrada correctamente en el sistema.");
        this.limpiarVenta();
      },
      error: (error) => {
        console.error('Error del servidor:', error);
        alert("❌ Error al procesar la transacción. Verifique el stock o la consola.");
      }
    });
  }

  // --- PASO 6.2: LIMPIAR LA PANTALLA Y REFRESCAR STOCK ---
  limpiarVenta(): void {
    this.carrito = [];
    this.total = 0;
    this.venta = {
      clienteId: 0,
      usuarioId: 0,
      metodoPago: "",
      detalles: []
    };
    
    // Volvemos a traer los productos porque Spring ya restó las cantidades en BD
    this.cargarProductos();
    this.inicializarUsuario();
  }
}