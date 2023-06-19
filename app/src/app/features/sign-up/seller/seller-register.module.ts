import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRegisterRoutingModule } from './seller-register-routing.module';
import { SellerRegisterComponent } from './seller-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SellerRegisterComponent],
  imports: [
    CommonModule,
    SellerRegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [SellerRegisterComponent],
})
export class SellerRegisterModule {}
