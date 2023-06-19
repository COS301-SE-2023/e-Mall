import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstructionComponent } from './construction.component';
import { NavbarModule } from '@shared/components/navbar/navbar.module';
import { FooterModule } from '@shared/components/footer/footer.module';

@NgModule({
  declarations: [ConstructionComponent],
  imports: [CommonModule, NavbarModule, FooterModule],
  exports: [ConstructionComponent],
})
export class ConstructionModule {}
