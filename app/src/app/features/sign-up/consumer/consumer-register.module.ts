import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsumerRegisterRoutingModule } from './consumer-register-routing.module';
import { ConsumerRegisterComponent } from './consumer-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConsumerRegisterComponent],
  imports: [
    CommonModule,
    ConsumerRegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ConsumerRegisterComponent],
})
export class ConsumerRegisterModule {}
