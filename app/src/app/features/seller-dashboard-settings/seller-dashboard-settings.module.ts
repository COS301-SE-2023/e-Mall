import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerDashboardSettingsComponent } from './seller-dashboard-settings.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { SellerNavModule } from '@shared/components/seller-nav/seller-nav.module';
import { ReactiveFormsModule } from '@angular/forms';



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
    ReactiveFormsModule
  ]
})
export class SellerDashboardSettingsModule { }
