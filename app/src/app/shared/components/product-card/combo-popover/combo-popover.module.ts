import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComboPopoverComponent } from './combo-popover.component';

@NgModule({
  declarations: [ComboPopoverComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [ComboPopoverComponent],
})
export class ComboPopoverModule {}
