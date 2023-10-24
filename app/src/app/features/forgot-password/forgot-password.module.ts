import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewSizeModule } from '@app/shared/directives/view-size/view-size.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ViewSizeModule,
    ForgotPasswordRoutingModule,
  ],
  exports: [ForgotPasswordComponent],
})
export class ForgotPasswordModule {}
