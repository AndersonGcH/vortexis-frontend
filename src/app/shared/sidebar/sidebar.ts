import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
 
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink], // 👈 Importamos RouterLink para los enlaces del menú
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {}
