import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCustomerProfileComponent } from './edit-customer-profile.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EditCustomerProfileComponent
  ],
  imports: [
    CommonModule,
    NavbarModule,
    FooterModule,
    IonicModule,
    CustomerProfileSidenavModule,
    ReactiveFormsModule

  ]
})
export class EditCustomerProfileModule { }
