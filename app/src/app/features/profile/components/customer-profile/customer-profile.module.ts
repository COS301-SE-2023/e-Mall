import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerProfileComponent } from './customer-profile.component';
import { IonicModule } from '@ionic/angular';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';



@NgModule({
  declarations: [
    CustomerProfileComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    NavbarModule,
    IonicModule,
    CustomerProfileSidenavModule
  ]
})
export class CustomerProfileModule { }
