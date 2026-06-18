import { Routes } from '@angular/router';

import { Login } from './pages/login/login';

import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin';

import { DashboardVendedor } from './pages/dashboard-vendedor/dashboard-vendedor';

import { DashboardAlmaceneroComponent } from './pages/dashboard-almacenero/dashboard-almacenero';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Categorias } from './pages/categorias/categorias';
import { Productos } from './pages/productos/productos';
import { Clientes } from './pages/clientes/clientes';
import { Proveedores } from './pages/proveedores/proveedores';
import { VentasComponent } from './pages/ventas/ventas';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

{
  path:'',
  component: MainLayout,
  children:[
      {
        path: 'dashboard-admin',
        component: DashboardAdminComponent
      },
      // 2️⃣ AGREGA ESTA LÍNEA AQUÍ ADENTRO 🔥
      {
        path: 'categorias',
        component: Categorias // Coloca el nombre exacto de la clase de tu archivo categorias.ts
      },
      {
        path: 'productos',
        component: Productos 
      },
      {       
        path: 'clientes',
        component: Clientes 
      },
      {       
        path: 'proveedores',
        component: Proveedores
      },
      {
        path: 'ventas',
        component: VentasComponent
      }
    ]
},

  {
    path: 'dashboard-vendedor',
    component: DashboardVendedor
  },

  {
    path: 'dashboard-almacenero',
    component: DashboardAlmaceneroComponent
  }

];