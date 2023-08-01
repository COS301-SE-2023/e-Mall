import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { IonicModule } from '@ionic/angular';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { RouteBreadcrumbModule } from '@shared/components/breadcrumbs/route-breadcrumb/route-breadcrumb.module';

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    ContactRoutingModule,
    IonicModule,
    NavbarModule,
    FooterModule,
    RouteBreadcrumbModule,
  ],
  exports: [ContactComponent],
})
export class ContactModule {}
