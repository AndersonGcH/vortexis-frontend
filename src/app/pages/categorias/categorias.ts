import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  CategoriaService
} from '../../core/services/categoria.service';

import {
  Categoria
} from '../../models/categoria';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {

  categorias: Categoria[] = [];

  categoria: Categoria = {
    nombre: ''
  };

  modoEdicion = false;
  mostrarModal = false; 

  constructor(
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService
      .listar()
      .subscribe({
        next: response => {
          this.categorias = response.sort((a: any, b: any) => a.id - b.id);
          this.cdr.detectChanges();
        }
      });
  }

  editar(categoria: Categoria) {
    this.categoria = {
      ...categoria
    };
    this.modoEdicion = true;
    this.mostrarModal = true; 
  }

  abrirModal() {
    this.modoEdicion = false;
    this.categoria = { nombre: '' }; 
    this.mostrarModal = true; 
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.resetFormulario();
  }

 guardar() {
    if (this.modoEdicion && this.categoria.id) {
      Swal.fire({
        title: '¿Confirmar cambios?',
        text: `¿Estás seguro de actualizar esta categoría a "${this.categoria.nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd', 
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          
          this.categoriaService
            .actualizar(this.categoria.id!, this.categoria)
            .subscribe({
              next: (categoriaEditada: any) => {
                this.categorias = this.categorias.map(cat => 
                  cat.id === categoriaEditada.id ? categoriaEditada : cat
                );
                this.cerrarModal(); 
                
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Categoría actualizada con éxito',
                  showConfirmButton: false,
                  timer: 1500,
                  toast: true 
                });
                
                this.cdr.detectChanges();
              },
              error: (err) => console.error('Error al actualizar:', err)
            });
        }
      });

    } else {
      this.categoriaService
        .guardar(this.categoria)
        .subscribe({
          next: (categoriaGuardada: any) => {
            this.categorias.push(categoriaGuardada); 
            this.cerrarModal(); 
            
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Categoría guardada con éxito',
              showConfirmButton: false,
              timer: 1500,
              toast: true 
            });

            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error al guardar:', err)
        });
    }
  }

eliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', 
      cancelButtonColor: '#6c757d',  
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.categoriaService.eliminar(id).subscribe({
          next: () => {
            this.categorias = this.categorias.filter(cat => cat.id !== id);
            this.cdr.detectChanges();

            Swal.fire({
              title: '¡Eliminado!',
              text: 'La categoría ha sido borrada.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
            console.error(err);
          }
        });

      }
    });
  }

  resetFormulario() {
    this.categoria = {
      nombre: ''
    };
    this.modoEdicion = false;
  }
}