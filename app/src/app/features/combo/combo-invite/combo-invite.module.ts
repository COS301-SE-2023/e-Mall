import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComboInviteComponent } from './combo-invite.component';

@NgModule({
  declarations: [ComboInviteComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [ComboInviteComponent],
})
export class ComboInviteModule {}
