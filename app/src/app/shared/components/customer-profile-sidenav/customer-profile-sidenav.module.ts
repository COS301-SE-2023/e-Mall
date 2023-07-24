import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerProfileSidenavComponent } from './customer-profile-sidenav.component';
import { IonicModule } from '@ionic/angular';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';



@NgModule({
  declarations: [
    CustomerProfileSidenavComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    NavbarModule,
    IonicModule
  ],
  exports: [CustomerProfileSidenavComponent],
})
export class CustomerProfileSidenavModule { }
