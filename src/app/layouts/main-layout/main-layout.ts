import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 👈 Importamos el cargador de rutas nativo

// 📂 Importa tus componentes personalizados (Ajusta las rutas según tus carpetas)
import { NavbarComponent } from '../../shared/navbar/navbar'; 
import { SidebarComponent } from '../../shared/sidebar/sidebar';
@Component({
  selector: 'app-main-layout',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
