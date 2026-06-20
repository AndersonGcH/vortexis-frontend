import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarVendedor } from './sidebar-vendedor';

describe('SidebarVendedor', () => {
  let component: SidebarVendedor;
  let fixture: ComponentFixture<SidebarVendedor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarVendedor],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarVendedor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
