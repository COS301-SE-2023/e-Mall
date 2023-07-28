import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfileComponent } from './customer-profile.component';

describe('CustomerProfileComponent', () => {
  let component: CustomerProfileComponent;
  let fixture: ComponentFixture<CustomerProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerProfileComponent]
    });
    fixture = TestBed.createComponent(CustomerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
