import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCombosComponent } from './my-combos.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    MyCombosComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    NavbarModule,
    IonicModule,
    CustomerProfileSidenavModule,
    MatProgressSpinnerModule
  ]
})
export class MyCombosModule { }
