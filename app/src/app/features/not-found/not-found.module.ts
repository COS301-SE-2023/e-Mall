import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundComponent } from './not-found.component';
import { NonFoundRoutingModule } from './non-found-routing.module';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, NonFoundRoutingModule],
  exports: [NotFoundComponent],
})
export class NotFoundModule {}
