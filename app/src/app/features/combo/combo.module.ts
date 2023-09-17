import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboComponent } from './combo.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { IonicModule } from '@ionic/angular';
import { ProductCardModule } from '@shared/components/product-card/product-card.module';
import { CustomerProfileSidenavModule } from '@shared/components/customer-profile-sidenav/customer-profile-sidenav.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComboEditModule } from './combo-edit/combo-edit.module';
import { RouterModule, Routes } from '@angular/router';
import { ComboInviteModule } from './combo-invite/combo-invite.module';
import { ComboBreadcrumbModule } from '@app/shared/components/breadcrumbs/combo-breadcrumb/combo-breadcrumb.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ComboComponent },
];
@NgModule({
  declarations: [ComboComponent],
  imports: [
    CommonModule,
    FooterModule,
    NavbarModule,
    IonicModule,
    CustomerProfileSidenavModule,
    MatProgressSpinnerModule,
    ProductCardModule,
    ComboEditModule,
    ComboInviteModule,
    ComboBreadcrumbModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class ComboModule {}
