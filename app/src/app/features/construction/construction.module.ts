import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstructionComponent } from './construction.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { ConstructionRoutingModule } from './construction-routing.module';

@NgModule({
  declarations: [ConstructionComponent],
  imports: [
    CommonModule,
    ConstructionRoutingModule,
    NavbarModule,
    FooterModule,
  ],
  exports: [ConstructionComponent],
})
export class ConstructionModule {}
