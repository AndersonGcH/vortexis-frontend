import { Routes } from '@angular/router';

import { Login } from './pages/login/login';

import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin';

import { DashboardVendedor } from './pages/dashboard-vendedor/dashboard-vendedor';

import { DashboardAlmacenero } from './pages/dashboard-almacenero/dashboard-almacenero';
import { MainLayout } from './layouts/main-layout/main-layout';

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
      path:'dashboard-admin',
      component: DashboardAdminComponent
    }
  ]
},

  {
    path: 'dashboard-vendedor',
    component: DashboardVendedor
  },

  {
    path: 'dashboard-almacenero',
    component: DashboardAlmacenero
  }

];