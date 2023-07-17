import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { CategoryBreadcrumbModule } from '../../shared/components/breadcrumbs/category-breadcrumb/category-breadcrumb.module';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    NgxsModule.forFeature(),
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    IonicModule,
    NavbarModule,
    FooterModule,
    CategoryBreadcrumbModule,
  ],
  exports: [ProductComponent],
})
export class ProductModule {}
