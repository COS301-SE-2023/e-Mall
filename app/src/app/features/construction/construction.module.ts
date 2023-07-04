import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstructionComponent } from './construction.component';
import { ConstructionRoutingModule } from './construction-routing.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ConstructionComponent],
  imports: [CommonModule, ConstructionRoutingModule, IonicModule],
  exports: [ConstructionComponent],
})
export class ConstructionModule {}
