import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedorLayout } from './vendedor-layout';

describe('VendedorLayout', () => {
  let component: VendedorLayout;
  let fixture: ComponentFixture<VendedorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendedorLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(VendedorLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
