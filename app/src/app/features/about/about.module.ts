import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';

import { FooterModule } from '@shared/components/footer/footer.module';
import { NavbarModule } from '@shared/components/navbar/navbar.module';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, AboutRoutingModule, NavbarModule, FooterModule],
  exports: [AboutComponent],
})
export class AboutModule {}
