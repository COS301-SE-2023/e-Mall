import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPopupComponent } from './navbar-popup.component';

describe('NavbarPopupComponent', () => {
  let component: NavbarPopupComponent;
  let fixture: ComponentFixture<NavbarPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarPopupComponent]
    });
    fixture = TestBed.createComponent(NavbarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
