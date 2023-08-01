import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignOutRoutingModule } from './sign-out-routing.module';
import { SignOutComponent } from './sign-out.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [SignOutComponent],
  imports: [CommonModule, SignOutRoutingModule, IonicModule],
  exports: [SignOutComponent],
})
export class SignOutModule {}
