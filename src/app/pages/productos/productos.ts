import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// Servicios
import { CategoriaService } from '../../core/services/categoria.service';
import { ProductoService } from '../../core/services/producto.service';
import { ProveedorService } from '../../core/services/proveedor.service';

// Modelos
import { Producto } from '../../models/producto';
import { Categoria } from '../../models/categoria';
import { Proveedor } from '../../models/proveedor';
import { MovimientoInventarioService } from '../../core/services/movimiento-inventario';
// 📦 PASO 2: IMPORTAR EL MÓDULO DE PAGINACIÓN
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NgxPaginationModule // 📦 PASO 2: AGREGAR A LOS IMPORTS
  ], 
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  // --- VARIABLES ADAPTADAS PARA EL BUSCADOR Y PAGINACIÓN ---
  productos: Producto[] = [];
  productosFiltrados: Producto[] = []; 
  textoBuscar = ''; 
cantidadIngreso = 0;
motivoIngreso = '';
productoSeleccionado: any;
mostrarModalStock = false;
  // 🔢 PASO 3: VARIABLE PARA EL CONTROL DE LA PÁGINA ACTUAL
  paginaActual = 1;

  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  // Variable formulario unificada (any)
  producto: any = {
    id: null,
    nombre: '',
    sku: '',
    precio: 0,
    stock: 0,
    stockMinimo: 0,
    descripcion: '',
    activo: true,
    categoriaId: 0,
    proveedorId: 0
  };

  // Variable de control
  modoEdicion = false;
  mostrarModal = false; 

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef,
    private movimientoService: MovimientoInventarioService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarProveedores();
  }

  abrirModalStock(producto: any) {

  this.productoSeleccionado = producto;

  this.cantidadIngreso = 0;

  this.motivoIngreso = '';
 this.mostrarModalStock = true;
}

cerrarModalStock() {

  this.mostrarModalStock = false;

  this.productoSeleccionado = null;

  this.cantidadIngreso = 0;

  this.motivoIngreso = '';

}
  cargarCategorias() {
    this.categoriaService.listar().subscribe({
      next: response => this.categorias = response
    });
  }

  cargarProveedores() {
    this.proveedorService.listar().subscribe({
      next: response => this.proveedores = response
    });
  }

  cargarProductos() {
    this.productoService.listar().subscribe({
      next: response => {
        this.productos = response;
        this.productosFiltrados = response; 
        this.buscar(); 
        this.cdr.detectChanges();
      }
    });
  }

  buscar() {
    const texto = this.textoBuscar.toLowerCase().trim();

    // 💡 Resetear a la página 1 al buscar para evitar cuadrantes vacíos
    this.paginaActual = 1;

    if (!texto) {
      this.productosFiltrados = this.productos;
      return;
    }

    this.productosFiltrados = this.productos.filter(p => {
      const cumpleNombre = p.nombre ? p.nombre.toLowerCase().includes(texto) : false;
      
      const skuTexto = p.sku ? p.sku.toString().toLowerCase() : '';
      const cumpleSku = skuTexto.includes(texto);

      return cumpleNombre || cumpleSku;
    });
  }

  editar(producto: any) {
    this.producto = {
      id: producto.id,
      nombre: producto.nombre,
      sku: producto.sku,
      precio: producto.precio,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
      descripcion: producto.descripcion,
      activo: producto.activo,
      categoriaId: producto.categoria?.id ?? 0,
      proveedorId: producto.proveedor?.id ?? 0
    };
    this.modoEdicion = true;
    this.mostrarModal = true; 
  }

  guardar() {
    if (this.modoEdicion && this.producto.id) {
      
      Swal.fire({
        title: '¿Confirmar cambios?',
        text: `¿Estás seguro de actualizar el producto "${this.producto.nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd', 
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        
        if (result.isConfirmed) {
          
          this.producto.usuarioId =
          Number(localStorage.getItem('usuarioId'));

          const catObj = this.categorias.find(c => c.id === Number(this.producto.categoriaId));
          const provObj = this.proveedores.find(p => p.id === Number(this.producto.proveedorId));

          const productoParaEnviar = {
            ...this.producto,
            categoria: catObj ? { id: catObj.id, nombre: catObj.nombre } : null,
            proveedor: provObj ? { id: provObj.id, razonSocial: provObj.razonSocial } : null
          };

          this.productoService
            .actualizar(this.producto.id, productoParaEnviar)
            .subscribe({
              next: (res) => {
                this.cerrarModal(); 
                this.cargarProductos(); 
                
                Swal.fire({ 
                  position: 'top-end', 
                  icon: 'success', 
                  title: 'Producto updated con éxito', 
                  showConfirmButton: false, 
                  timer: 1500, 
                  toast: true 
                });
              },
              error: (err) => {
                console.error('Error al actualizar el producto:', err);
                Swal.fire({
                  icon: 'error',
                  title: 'Error al actualizar',
                  text: 'Hubo un problema al intentar modificar el producto en el servidor.',
                  confirmButtonColor: '#0d6efd'
                });
              }
            });
        }
      });

    } else {
      this.productoService
        .guardar(this.producto)
        .subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarProductos();
            Swal.fire({ position: 'top-end', icon: 'success', title: 'Producto guardado', showConfirmButton: false, timer: 1500, toast: true });
          },
          error: (err) => console.error('Error al guardar:', err)
        });
    }
  }

  abrirModal() {
    this.modoEdicion = false;
    this.reset();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.reset();
  }

  reset() {
    this.producto = {
      id: null,
      nombre: '',
      sku: '',
      precio: 0,
      stock: 0,
      stockMinimo: 0,
      descripcion: '',
      activo: true,
      categoriaId: 0,
      proveedorId: 0
    };
    this.modoEdicion = false;
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer y el producto desaparecerá del inventario!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', 
      cancelButtonColor: '#6c757d',  
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true 
    }).then((result) => {
      
      if (result.isConfirmed) {
        this.productoService.eliminar(id).subscribe({
          next: () => {
            this.cargarProductos(); 
            
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Producto eliminado con éxito',
              showConfirmButton: false,
              timer: 1500,
              toast: true
            });
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo eliminar el producto. Verifica si tiene stock o dependencias.',
              confirmButtonColor: '#0d6efd'
            });
          }
        });
      }
      
    });
  }

  ingresarStock() {

  const movimiento = {

    tipo: 'ENTRADA',

    cantidad: this.cantidadIngreso,

    motivo: this.motivoIngreso,

    productoId: this.productoSeleccionado.id,

    usuarioId: Number(
      localStorage.getItem('usuarioId')
    )

  };

  this.movimientoService
      .registrar(movimiento)
      .subscribe({

        next: () => {

          this.cerrarModalStock();

          this.cargarProductos();

          Swal.fire({

            position: 'top-end',

            icon: 'success',

            title: 'Stock actualizado',

            showConfirmButton: false,

            timer: 1500,

            toast: true

          });

        },

        error: error => {

          console.error(error);

          Swal.fire({

            icon: 'error',

            title: 'Error',

            text: 'No se pudo registrar el ingreso de stock.'

          });

        }

      });

}
}