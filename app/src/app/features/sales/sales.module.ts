import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { IonicModule } from '@ionic/angular';

import { SellerNavModule } from '@shared/components/seller-nav/seller-nav.module';

@NgModule({
  declarations: [SalesComponent],
  imports: [CommonModule, SalesRoutingModule, IonicModule,SellerNavModule],
  exports: [SalesComponent],
})
export class SalesModule {}
