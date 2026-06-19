import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// Servicio y Modelo
import { ProveedorService } from '../../core/services/proveedor.service';
import { Proveedor } from '../../models/proveedor';

// 📦 PASO 2: IMPORTAR EL MÓDULO DE PAGINACIÓN
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgxPaginationModule // 📦 PASO 2: AGREGAR A LOS IMPORTS
  ],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css',
})
export class Proveedores implements OnInit {

  // --- VARIABLES ADAPTADAS PARA EL BUSCADOR Y PAGINACIÓN ---
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = []; 
  textoBuscar = ''; 

  // 🔢 PASO 3: VARIABLE PARA EL CONTROL DE LA PÁGINA ACTUAL
  paginaActual = 1;

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
  mostrarModal = false; 

  constructor(
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarProveedores();
  }

  // --- CARGAR PROVEEDORES RESPALDANDO LOS FILTROS ---
  cargarProveedores() {
    this.proveedorService.listar().subscribe({
      next: (response) => {
        this.proveedores = response;
        this.proveedoresFiltrados = response; 
        this.buscar(); 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
      }
    });
  }

  // --- MÉTODO BUSCAR() ADAPTADO PARA RESETEAR LA PAGINACIÓN ---
  buscar() {
    const texto = this.textoBuscar.toLowerCase().trim();

    // 💡 Resetear a la página 1 al buscar para evitar cuadrantes vacíos en tablas paginadas
    this.paginaActual = 1;

    if (!texto) {
      this.proveedoresFiltrados = this.proveedores;
      return;
    }

    this.proveedoresFiltrados = this.proveedores.filter(p => {
      const cumpleRazonSocial = p.razonSocial ? p.razonSocial.toLowerCase().includes(texto) : false;
      
      const rucTexto = p.ruc ? p.ruc.toString().toLowerCase() : '';
      const cumpleRuc = rucTexto.includes(texto);

      return cumpleRazonSocial || cumpleRuc;
    });
  }

  // 💾 Procesar persistencia (Guardar nuevo o Actualizar existente)
  guardar() {
    if (this.modoEdicion && this.proveedor.id) {
      
      Swal.fire({
        title: '¿Confirmar cambios?',
        text: `¿Estás seguro de actualizar los datos de "${this.proveedor.razonSocial}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd', 
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
    this.proveedor = { ...proveedor }; 
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
      confirmButtonColor: '#dc3545', 
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