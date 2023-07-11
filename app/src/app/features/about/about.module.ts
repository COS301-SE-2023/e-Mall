import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { IonicModule } from '@ionic/angular';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { RouteBreadcrumbModule } from '../../shared/components/breadcrumbs/route-breadcrumb/route-breadcrumb.module';
import { ConstructionModule } from '@features/construction/construction.module';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    IonicModule,
    NavbarModule,
    FooterModule,
    RouteBreadcrumbModule,
    ConstructionModule,
  ],
  exports: [AboutComponent],
})
export class AboutModule {}
