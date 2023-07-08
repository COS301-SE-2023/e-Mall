import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ToastComponent],
  imports: [CommonModule, IonicModule],
  exports: [ToastComponent],
  providers: [ToastComponent],
})
export class ToastModule {}
