import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRegisterRoutingModule } from './seller-register-routing.module';
import { SellerRegisterComponent } from './seller-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [SellerRegisterComponent],
  imports: [
    CommonModule,
    SellerRegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [SellerRegisterComponent],
})
export class SellerRegisterModule {}
