import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundComponent } from './not-found.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { RouteBreadcrumbModule } from '../../shared/components/breadcrumbs/route-breadcrumb/route-breadcrumb.module';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    NotFoundRoutingModule,
    RouterModule,
    IonicModule,
    NavbarModule,
    FooterModule,
    RouteBreadcrumbModule,
  ],
  exports: [NotFoundComponent],
})
export class NotFoundModule {}
