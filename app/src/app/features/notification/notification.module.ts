import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification.component';
import { NotificationService } from './services/notification.service';
import { NotificationFacade } from './services/notification.facade';
import { IonicModule } from '@ionic/angular';
import { NotificationState } from './states/notification.state';
import { NgxsModule } from '@ngxs/store';
import { NotificationDropdownComponent } from './components/notification-dropdown/notification-dropdown.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  declarations: [NotificationComponent, NotificationDropdownComponent],
  imports: [
    CommonModule,
    NgxsModule.forFeature([NotificationState]),
    IonicModule,
    ScrollingModule,
  ],
  exports: [NotificationComponent],
  providers: [NotificationService, NotificationFacade],
})
export class NotificationModule {}
