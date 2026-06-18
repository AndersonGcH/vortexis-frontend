import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAlmaceneroComponent } from './dashboard-almacenero';

describe('DashboardAlmacenero', () => {
  let component: DashboardAlmaceneroComponent;
  let fixture: ComponentFixture<DashboardAlmaceneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAlmaceneroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAlmaceneroComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
