import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAlmacenero } from './dashboard-almacenero';

describe('DashboardAlmacenero', () => {
  let component: DashboardAlmacenero;
  let fixture: ComponentFixture<DashboardAlmacenero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAlmacenero],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAlmacenero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
