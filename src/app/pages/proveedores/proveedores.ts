import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// Servicio y Modelo
import { ProveedorService } from '../../core/services/proveedor.service';
import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css',
})
export class Proveedores implements OnInit {

  proveedores: Proveedor[] = [];

  // Objeto base para el formulario de enlace bidireccional
  proveedor: Proveedor = {
    razonSocial: '',
    ruc: '',
    telefono: '',
    correo: '',
    direccion: '',
    activo: true
  };

  // Variables para la gestión de la interfaz de usuario
  modoEdicion = false;
  mostrarModal = false; // Controla la visibilidad del formulario flotante

  constructor(
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarProveedores();
  }

  // 🔄 Obtener lista de proveedores desde el Backend
  cargarProveedores() {
    this.proveedorService.listar().subscribe({
      next: (response) => {
        this.proveedores = response;
        this.cdr.detectChanges(); // Fuerza la actualización visual de la tabla
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
      }
    });
  }

  // 💾 Procesar persistencia (Guardar nuevo o Actualizar existente)
  guardar() {
    if (this.modoEdicion && this.proveedor.id) {
      
      // 🛑 Ventana de confirmación previa antes de impactar los cambios del PUT
      Swal.fire({
        title: '¿Confirmar cambios?',
        text: `¿Estás seguro de actualizar los datos de "${this.proveedor.razonSocial}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd', // Azul Bootstrap
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.proveedorService.actualizar(this.proveedor.id!, this.proveedor).subscribe({
            next: () => {
              this.cerrarModal();
              this.cargarProveedores();
              
              // Notificación flotante rápida de éxito (Toast)
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Proveedor actualizado con éxito',
                showConfirmButton: false,
                timer: 1500,
                toast: true
              });
            },
            error: (err) => {
              console.error('Error al actualizar proveedor:', err);
              Swal.fire('Error', 'No se pudieron guardar las modificaciones.', 'error');
            }
          });
        }
      });

    } else {
      // 🚀 Flujo directo para registrar un nuevo proveedor (POST)
      this.proveedorService.guardar(this.proveedor).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarProveedores();
          
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Proveedor registrado con éxito',
            showConfirmButton: false,
            timer: 1500,
            toast: true
          });
        },
        error: (err) => {
          console.error('Error al guardar proveedor:', err);
          Swal.fire('Error', 'No se pudo dar de alta al proveedor.', 'error');
        }
      });
    }
  }

  // ✏️ Cargar datos del elemento seleccionado en el formulario y abrir modal
  editar(proveedor: Proveedor) {
    this.proveedor = { ...proveedor }; // Clonación para romper la referencia reactiva en tiempo real
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  // 🗑️ Dar de baja / Eliminar un proveedor con control preventivo
  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar proveedor?',
      text: '¡Esta acción revocará al proveedor y podría afectar productos asociados!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Rojo destructivo
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.eliminar(id).subscribe({
          next: () => {
            this.cargarProveedores();
            
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Proveedor eliminado del sistema',
              showConfirmButton: false,
              timer: 1500,
              toast: true
            });
          },
          error: (err) => {
            console.error('Error al eliminar proveedor:', err);
            Swal.fire({
              icon: 'error',
              title: 'No se puede eliminar',
              text: 'Este proveedor posee restricciones de integridad en Java (productos amarrados a él).',
              confirmButtonColor: '#0d6efd'
            });
          }
        });
      }
    });
  }

  // 🎛️ Métodos auxiliares de control del modal flotante
  abrirModal() {
    this.modoEdicion = false;
    this.reset();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.reset();
  }

  // 🧹 Reestablecer estados del formulario
  reset() {
    this.proveedor = {
      razonSocial: '',
      ruc: '',
      telefono: '',
      correo: '',
      direccion: '',
      activo: true
    };
    this.modoEdicion = false;
  }
}