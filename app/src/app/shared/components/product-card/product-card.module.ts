import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProductCardComponent } from './product-card.component';
import { ComboPopoverModule } from './combo-popover/combo-popover.module';
import { ProductCardFacade } from './services/product-card.facade';
import { ProductCardPlaceholderComponent } from './product-card-placeholder/product-card-placeholder.component';

@NgModule({
  declarations: [ProductCardComponent, ProductCardPlaceholderComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatListModule,
    MatCardModule,
    IonicModule,
    ComboPopoverModule,
  ],
  providers: [ProductCardFacade],
  exports: [ProductCardComponent, ProductCardPlaceholderComponent],
})
export class ProductCardModule {}
