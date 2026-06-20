import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarAlmacenero } from '../../shared/sidebar-almacenero/sidebar-almacenero';

@Component({
  selector: 'app-almacenero-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarAlmacenero
  ],
  templateUrl: './almacenero-layout.html',
  styleUrl: './almacenero-layout.css'
})
export class AlmaceneroLayoutComponent {
}