import { Routes } from '@angular/router';

import { Login } from './pages/login/login';

import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin';

import { DashboardVendedorComponent } from './pages/dashboard-vendedor/dashboard-vendedor';

import { DashboardAlmaceneroComponent } from './pages/dashboard-almacenero/dashboard-almacenero';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Categorias } from './pages/categorias/categorias';
import { Productos } from './pages/productos/productos';
import { Clientes } from './pages/clientes/clientes';
import { Proveedores } from './pages/proveedores/proveedores';
import { VentasComponent } from './pages/ventas/ventas';
import { HistorialVentas } from './pages/historial-ventas/historial-ventas';
import { VendedorLayoutComponent } from './layouts/vendedor-layout/vendedor-layout';
import { AlmaceneroLayoutComponent } from './layouts/almacenero-layout/almacenero-layout';
import { MovimientosInventarioComponent} from './pages/movimientos-inventario/movimientos-inventario';
import { Usuarios } from './pages/usuarios/usuarios';

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
      },
      {
        path: 'historial-ventas',
        component: HistorialVentas
      },
      {
        path: 'movimientos-inventario',
        component: MovimientosInventarioComponent
      },
      {
        path: 'usuarios',
        component: Usuarios
      }
    ]
},

{
  path: 'vendedor',
  component: VendedorLayoutComponent,
  children: [

    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },

    {
      path: 'dashboard',
      component: DashboardVendedorComponent
    },

    {
      path: 'ventas',
      component: VentasComponent
    },

    {
      path: 'historial',
      component: HistorialVentas
    }

  ]
},


{
  path: 'almacenero',
  component: AlmaceneroLayoutComponent, // Tu componente layout para el almacenero
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'dashboard',
      component: DashboardAlmaceneroComponent // O el nombre exacto de tu componente
    },
    {
      path: 'productos',
      component: Productos // Tu componente de gestión de inventario/productos
    },
    {
      path: 'proveedores',
      component: Proveedores // Tu componente de gestión de inventario/productos
    },
    {
        path: 'movimientos-inventario',
        component: MovimientosInventarioComponent
    }
  ]
}

];