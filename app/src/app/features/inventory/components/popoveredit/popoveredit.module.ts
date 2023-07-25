import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopovereditComponent } from './popoveredit.component';

@NgModule({
  declarations: [PopovereditComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [PopovereditComponent],
})
export class PopovereditModule {}
