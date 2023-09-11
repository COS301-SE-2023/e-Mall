import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopovernewComponent } from './popovernew.component';

@NgModule({
  declarations: [PopovernewComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [PopovernewComponent],
})
export class PopovernewModule {}