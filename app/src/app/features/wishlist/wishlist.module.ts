import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './wishlist.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { ProductCardModule } from '@shared/components/product-card/product-card.module';
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: WishlistComponent },
];
@NgModule({
  declarations: [WishlistComponent],
  imports: [
    CommonModule,
    FooterModule,
    NavbarModule,
    IonicModule,
    ProductCardModule,
    CustomerProfileSidenavModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class WishlistModule {}
