import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsumerRegisterRoutingModule } from './consumer-register-routing.module';
import { ConsumerRegisterComponent } from './components/consumer-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewSizeModule } from '@shared/directives/view-size/view-size.module';
import { AuthModule } from '@app/features/auth/auth.module';
import { ConsumerFacade } from './services/consumer.facade';

@NgModule({
  declarations: [ConsumerRegisterComponent],
  imports: [
    CommonModule,
    ConsumerRegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthModule,
    ViewSizeModule,
  ],
  exports: [ConsumerRegisterComponent],
  providers: [ConsumerFacade],
})
export class ConsumerRegisterModule {}
