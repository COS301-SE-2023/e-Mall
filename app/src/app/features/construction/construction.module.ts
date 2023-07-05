import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstructionComponent } from './construction.component';
import { ConstructionRoutingModule } from './construction-routing.module';
import { IonicModule } from '@ionic/angular';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';

@NgModule({
  declarations: [ConstructionComponent],
  imports: [
    CommonModule,
    ConstructionRoutingModule,
    IonicModule,
    NavbarModule,
    FooterModule,
  ],
  exports: [ConstructionComponent],
})
export class ConstructionModule {}
