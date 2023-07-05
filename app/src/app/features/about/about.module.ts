import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { IonicModule } from '@ionic/angular';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    IonicModule,
    NavbarModule,
    FooterModule,
  ],
  exports: [AboutComponent],
})
export class AboutModule {}
