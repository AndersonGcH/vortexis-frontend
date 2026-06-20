import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmaceneroLayout } from './almacenero-layout';

describe('AlmaceneroLayout', () => {
  let component: AlmaceneroLayout;
  let fixture: ComponentFixture<AlmaceneroLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlmaceneroLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(AlmaceneroLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
