import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerRegisterRoutingModule } from './seller-register-routing.module';
import { SellerRegisterComponent } from './components/seller-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewSizeModule } from '@shared/directives/view-size/view-size.module';
import { ToastModule } from '@shared/components/toast/toast.module';
import { SellerFacade } from './services/seller-register.facade';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [SellerRegisterComponent],
  imports: [
    CommonModule,
    SellerRegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ViewSizeModule,
    ToastModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [SellerRegisterComponent],
  providers: [
    SellerFacade,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true, displayDefaultIndicatorType: false },
    },
  ],
})
export class SellerRegisterModule {}
