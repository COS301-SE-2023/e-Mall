import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboComponent } from './combo.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { ProductCardModule } from "@shared/components/product-card/product-card.module";
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComboEditModule } from './combo-edit/combo-edit.module';



@NgModule({
  declarations: [
    ComboComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    NavbarModule,
    IonicModule,
    ProductCardModule,
    CustomerProfileSidenavModule,
    MatProgressSpinnerModule,
    ComboEditModule
  ]
})
export class ComboModule { }
