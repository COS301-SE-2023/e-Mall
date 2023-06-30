import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundComponent } from './not-found.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NotFoundRoutingModule } from './not-found-routing.module';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, NotFoundRoutingModule, RouterModule, IonicModule],
  exports: [NotFoundComponent],
})
export class NotFoundModule {}
