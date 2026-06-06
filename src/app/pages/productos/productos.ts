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

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Ambos declarados para evitar errores de compilación
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  // Paso 1: Variable formulario unificada (any)
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

  // Paso 2: Variable de control
  modoEdicion = false;
  mostrarModal = false; // Mantiene el modal oculto hasta que se requiera

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarProveedores();
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
        this.cdr.detectChanges();
      }
    });
  }

  // Paso 3: Método editar adaptado para abrir tu modal flotante
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
    this.mostrarModal = true; // 🔥 Abre el modal automáticamente al dar editar
  }

 guardar() {
    if (this.modoEdicion && this.producto.id) {
      
      // 🛑 PASO 1: Lanzamos primero el SweetAlert de confirmación de cambios
      Swal.fire({
        title: '¿Confirmar cambios?',
        text: `¿Estás seguro de actualizar el producto "${this.producto.nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd', // Azul primario de Bootstrap
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        
        // 🚀 PASO 2: Si el usuario presiona "Sí, actualizar", se ejecuta la petición
        if (result.isConfirmed) {
          
          // Buscamos los objetos completos en memoria para complacer a Hibernate en Java
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
                this.cerrarModal(); // 🧹 Cerramos el modal flotante
                this.cargarProductos(); // 🔄 Refrescamos la tabla al instante
                
                // 🎉 Notificación rápida de éxito (Toast)
                Swal.fire({ 
                  position: 'top-end', 
                  icon: 'success', 
                  title: 'Producto actualizado con éxito', 
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
      // Guardar directo en creación (Se queda idéntico sin confirmación previa)
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

  // Controladores del modal
  abrirModal() {
    this.modoEdicion = false;
    this.reset();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.reset();
  }

  // Paso 5: Reset completo
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
    // 🎨 Cambiamos el confirm viejo por un SweetAlert dinámico y estético
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer y el producto desaparecerá del inventario!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Rojo peligro de Bootstrap
      cancelButtonColor: '#6c757d',  // Gris secundario
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true // Pone el botón de cancelar a la izquierda (más natural)
    }).then((result) => {
      
      // 🚀 Si el usuario confirma el modal:
      if (result.isConfirmed) {
        this.productoService.eliminar(id).subscribe({
          next: () => {
            this.cargarProductos(); // Refrescamos la tabla al instante
            
            // Notificación flotante (Toast) de éxito en la esquina superior derecha
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
            // Modal de error por si el producto está amarrado a una orden o venta interna
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


}