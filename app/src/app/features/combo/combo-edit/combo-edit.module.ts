import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComboEditComponent } from './combo-edit.component';

@NgModule({
  declarations: [ComboEditComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [ComboEditComponent],
})
export class ComboEditModule {}
