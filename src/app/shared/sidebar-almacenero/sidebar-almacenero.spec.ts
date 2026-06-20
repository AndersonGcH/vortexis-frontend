import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAlmacenero } from './sidebar-almacenero';

describe('SidebarAlmacenero', () => {
  let component: SidebarAlmacenero;
  let fixture: ComponentFixture<SidebarAlmacenero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAlmacenero],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarAlmacenero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
