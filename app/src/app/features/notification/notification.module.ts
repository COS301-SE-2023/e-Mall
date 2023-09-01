import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification.component';
import { NotificationService } from './services/notification.service';
import { NotificationFacade } from './services/notification.facade';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, IonicModule],
  exports: [NotificationComponent],
  providers: [NotificationService, NotificationFacade],
})
export class NotificationModule {}
