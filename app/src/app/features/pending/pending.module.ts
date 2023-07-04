import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingComponent } from './pending.component';
import { PendingRoutingModule } from './pending-routing.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PendingComponent],
  imports: [CommonModule, PendingRoutingModule, RouterModule, IonicModule],
  exports: [PendingComponent],
})
export class PendingModule {}
