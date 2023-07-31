import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAnalyticsRoutingModule } from './product-analytics-routing.module';
import { ProductAnalyticsComponent } from './product-analytics.component';
import { IonicModule } from '@ionic/angular';

import { SellerNavModule } from '@shared/components/seller-nav/seller-nav.module';

@NgModule({
  declarations: [ProductAnalyticsComponent],
  imports: [
    CommonModule,
    ProductAnalyticsRoutingModule,
    IonicModule,
    SellerNavModule,
  ],
  exports: [ProductAnalyticsComponent],
})
export class ProductAnalyticsModule {}
