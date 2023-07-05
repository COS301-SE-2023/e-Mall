import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [SalesComponent],
  imports: [CommonModule, SalesRoutingModule, IonicModule],
  exports: [SalesComponent],
})
export class SalesModule {}
