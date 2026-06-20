import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../../shared/navbar/navbar';
import { SidebarVendedor} from '../../shared/sidebar-vendedor/sidebar-vendedor';

@Component({
  selector: 'app-vendedor-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarVendedor
  ],
  templateUrl: './vendedor-layout.html',
  styleUrl: './vendedor-layout.css'
})
export class VendedorLayoutComponent {
}