import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './wishlist.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { ProductCardModule } from "@shared/components/product-card/product-card.module";
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';



@NgModule({
  declarations: [
    WishlistComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    NavbarModule,
    IonicModule,
    ProductCardModule,
    CustomerProfileSidenavModule
  ]
})
export class WishlistModule { }
