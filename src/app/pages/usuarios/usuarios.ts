import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../models/usuario';

import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  usuarios: Usuario[] = [];

  usuariosFiltrados: Usuario[] = [];

  textoBuscar = '';

  paginaActual = 1;

  usuario: Usuario = {

    nombre: '',

    email: '',

    password: '',

    rol: 'VENDEDOR',

    activo: true

  };

  modoEdicion = false;

  mostrarModal = false;

  constructor(

    private usuarioService: UsuarioService,

    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit() {

    this.cargarUsuarios();

  }

  cargarUsuarios() {

    this.usuarioService
      .listar()
      .subscribe({

        next: response => {

          this.usuarios = response;

          this.usuariosFiltrados = response;

          this.buscar();

          this.cdr.detectChanges();

        }

      });

  }

  buscar() {

    const texto = this.textoBuscar
      .toLowerCase()
      .trim();

    this.paginaActual = 1;

    if (!texto) {

      this.usuariosFiltrados = this.usuarios;

      return;

    }

    this.usuariosFiltrados =
      this.usuarios.filter(u =>

        u.nombre.toLowerCase().includes(texto)

        ||

        u.email.toLowerCase().includes(texto)

      );

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

  this.usuario = {

    id: undefined,

    nombre: '',

    email: '',

    password: '',

    rol: 'VENDEDOR',

    activo: true

  };

}

editar(usuario: Usuario) {

  this.usuario = {

    id: usuario.id,

    nombre: usuario.nombre,

    email: usuario.email,

    password: '',

    rol: usuario.rol,

    activo: usuario.activo

  };

  this.modoEdicion = true;

  this.mostrarModal = true;

}

guardar() {

if (!this.modoEdicion && !this.usuario.password.trim()) {

  Swal.fire({

    icon: 'warning',

    title: 'Contraseña requerida',

    text: 'Debe ingresar una contraseña.'

  });

  return;

}

  if (this.modoEdicion && this.usuario.id) {



    this.usuarioService
      .actualizar(
        this.usuario.id,
        this.usuario
      )
      .subscribe({

        next: () => {

          this.cerrarModal();

          this.cargarUsuarios();

          Swal.fire({

            icon: 'success',

            title: 'Usuario actualizado',

            timer: 1500,

            showConfirmButton: false,

            toast: true,

            position: 'top-end'

          });

        }

      });

  } else {

    this.usuarioService
      .guardar(this.usuario)
      .subscribe({

        next: () => {

          this.cerrarModal();

          this.cargarUsuarios();

          Swal.fire({

            icon: 'success',

            title: 'Usuario registrado',

            timer: 1500,

            showConfirmButton: false,

            toast: true,

            position: 'top-end'

          });

        }

      });

  }

}

eliminar(id: number) {

  Swal.fire({

    title: '¿Desactivar usuario?',

    text: 'El usuario ya no podrá iniciar sesión.',

    icon: 'warning',

    showCancelButton: true,

    confirmButtonText: 'Sí',

    cancelButtonText: 'Cancelar'

  }).then(result => {

    if (result.isConfirmed) {

      this.usuarioService
        .eliminar(id)
        .subscribe({

          next: () => {

            this.cargarUsuarios();

            Swal.fire({

              icon: 'success',

              title: 'Usuario desactivado',

              timer: 1500,

              showConfirmButton: false,

              toast: true,

              position: 'top-end'

            });

          }

        });

    }

  });

}



}