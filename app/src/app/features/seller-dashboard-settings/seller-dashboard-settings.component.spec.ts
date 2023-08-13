import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerDashboardSettingsComponent } from './seller-dashboard-settings.component';

describe('SellerDashboardSettingsComponent', () => {
  let component: SellerDashboardSettingsComponent;
  let fixture: ComponentFixture<SellerDashboardSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerDashboardSettingsComponent]
    });
    fixture = TestBed.createComponent(SellerDashboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
