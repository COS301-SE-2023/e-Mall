import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerDashboardSettingsComponent } from './seller-dashboard-settings.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { SellerNavModule } from '@shared/components/seller-nav/seller-nav.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileState } from '@features/profile/states/profile.state';
import { ProfileService } from '@features/profile/services/profile.service';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { NgxsModule } from '@ngxs/store';



@NgModule({
  declarations: [
    SellerDashboardSettingsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    NavbarModule,
    FooterModule,
    SellerNavModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([ProfileState]),
  ],
  exports: [SellerDashboardSettingsComponent],
  providers: [ProfileService, ProfileFacade]

})
export class SellerDashboardSettingsModule { }
