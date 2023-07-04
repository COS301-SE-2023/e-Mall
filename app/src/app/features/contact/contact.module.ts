import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ContactComponent],
  imports: [CommonModule, ContactRoutingModule, IonicModule],
  exports: [ContactComponent],
})
export class ContactModule {}
