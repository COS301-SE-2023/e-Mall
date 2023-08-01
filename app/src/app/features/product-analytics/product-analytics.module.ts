import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductAnalyticsRoutingModule } from './product-analytics-routing.module';
import { ProductAnalyticsComponent } from './product-analytics.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SellerNavModule } from '@shared/components/seller-nav/seller-nav.module';

@NgModule({
  declarations: [ProductAnalyticsComponent],
  imports: [
    CommonModule,
    ProductAnalyticsRoutingModule,
    IonicModule,
    SellerNavModule,
    FormsModule,
  ],
  exports: [ProductAnalyticsComponent],
})
export class ProductAnalyticsModule {}
