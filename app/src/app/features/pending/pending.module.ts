import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingComponent } from './pending.component';
import { PendingRoutingModule } from './pending-routing.module';

@NgModule({
  declarations: [PendingComponent],
  imports: [CommonModule, PendingRoutingModule],
  exports: [PendingComponent],
})
export class PendingModule {}
