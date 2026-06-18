import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// Servicio y Modelo
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {

  clientes: Cliente[] = [];

  // Objeto unificado para el formulario
  cliente: Cliente = {
    nombres: '',
    dni: '',
    ruc: '',
    correo: '',
    telefono: '',
    direccion: '',
    activo: true
  };

  // Variables de control de interfaz
  modoEdicion = false;
  mostrarModal = false; // Mantiene el modal cerrado hasta que se invoque

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  // 🔄 Cargar Clientes
  cargarClientes() {
    this.clienteService.listar().subscribe({
      next: (response) => {
        this.clientes = response;
        this.cdr.detectChanges(); // Fuerza el refresco de la tabla en el HTML
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  // 💾 Guardar o Actualizar
  guardar() {
    if (this.modoEdicion && this.cliente.id) {
      
      // 🛑 Confirmación previa antes de Modificar un cliente existente
      Swal.fire({
        title: '¿Confirmar cambios?',
        text: `¿Estás seguro de actualizar los datos de "${this.cliente.nombres}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd', // Azul Bootstrap
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.clienteService.actualizar(this.cliente.id!, this.cliente).subscribe({
            next: () => {
              this.cerrarModal();
              this.cargarClientes();
              
              // Alerta flotante de éxito
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cliente actualizado con éxito',
                showConfirmButton: false,
                timer: 1500,
                toast: true
              });
            },
            error: (err) => {
              console.error(err);
              Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error');
            }
          });
        }
      });

    } else {
      // 🚀 Guardar nuevo Cliente de manera directa
      this.clienteService.guardar(this.cliente).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarClientes();
          
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Cliente registrado con éxito',
            showConfirmButton: false,
            timer: 1500,
            toast: true
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo registrar al cliente.', 'error');
        }
      });
    }
  }

  // ✏️ Preparar datos para Editar
  editar(cliente: Cliente) {
    this.cliente = { ...cliente }; // Rompe la referencia en memoria con la fila
    this.modoEdicion = true;
    this.mostrarModal = true; // 🔥 Abre el modal automáticamente
  }

  // 🗑️ Eliminar Cliente con Modal de Advertencia
  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar cliente?',
      text: 'Esta acción dará de baja al cliente del sistema Vortexis.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Rojo peligro
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.eliminar(id).subscribe({
          next: () => {
            this.cargarClientes();
            
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Cliente eliminado',
              showConfirmButton: false,
              timer: 1500,
              toast: true
            });
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Este cliente tiene dependencias activas (Ventas u Órdenes).', 'error');
          }
        });
      }
    });
  }

  // 🎛️ Controladores del Modal Flotante
  abrirModal() {
    this.modoEdicion = false;
    this.reset();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.reset();
  }

  // 🧹 Limpieza de formulario
  reset() {
    this.cliente = {
      nombres: '',
      dni: '',
      ruc: '',
      correo: '',
      telefono: '',
      direccion: '',
      activo: true
    };
    this.modoEdicion = false;
  }
}