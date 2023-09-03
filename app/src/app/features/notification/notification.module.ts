import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification.component';
import { NotificationService } from './services/notification.service';
import { NotificationFacade } from './services/notification.facade';
import { IonicModule } from '@ionic/angular';
import { NotificationState } from './states/notification.state';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    NgxsModule.forFeature([NotificationState]),
    IonicModule,
  ],
  exports: [NotificationComponent],
  providers: [NotificationService, NotificationFacade],
})
export class NotificationModule {}
