import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerDashboardSettingsComponent } from './seller-dashboard-settings.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthModule } from '@features/auth/auth.module';
import { ProfileModule } from '@features/profile/profile.module';
import { IonicModule } from '@ionic/angular';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsModule } from '@ngxs/store';

import { SellerNavComponent } from '@shared/components/seller-nav/seller-nav.component';
import { NotificationModule } from '../notification/notification.module';

describe('SellerDashboardSettingsComponent', () => {
  let component: SellerDashboardSettingsComponent;
  let fixture: ComponentFixture<SellerDashboardSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerDashboardSettingsComponent, SellerNavComponent],
      imports: [
        NgxsModule.forRoot([]),
        IonicModule,
        AuthModule,
        ProfileModule,
        HttpClientTestingModule,
        NgxsDispatchPluginModule,
        NotificationModule,
      ],
    });
    fixture = TestBed.createComponent(SellerDashboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
