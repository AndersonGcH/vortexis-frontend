import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  DashboardService
} from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-almacenero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-almacenero.html',
  styleUrl: './dashboard-almacenero.css'
})
export class DashboardAlmaceneroComponent
implements OnInit {

  cantidadStockBajo = 0;

  productosCriticos: any[] = [];

  constructor(

    private dashboardService:
    DashboardService,

    private cdr:
    ChangeDetectorRef

  ) {}

  ngOnInit() {

    this.dashboardService
      .obtenerStockBajo()
      .subscribe({

        next: response => {

          this.cantidadStockBajo =
            response;

        }

      });

    this.dashboardService
      .obtenerProductosCriticos()
      .subscribe({

        next: response => {

          this.productosCriticos =
            response;

          this.cdr.detectChanges();

        }

      });

  }

}