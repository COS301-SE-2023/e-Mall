import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification.component';
import { NotificationService } from './services/notification.service';
import { NotificationFacade } from './services/notification.facade';
import { IonicModule } from '@ionic/angular';
import { NotificationState } from './states/notification.state';
import { NgxsModule } from '@ngxs/store';
import { NotificationPannelComponent } from './components/notification-pannel/notification-pannel.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';
import { SettingsPannelComponent } from './components/settings-pannel/settings-pannel.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    NotificationComponent,
    NotificationPannelComponent,
    NotificationCardComponent,
    SettingsPannelComponent,
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([NotificationState]),
    IonicModule,
    ScrollingModule,
  ],
  exports: [
    NotificationComponent,
    NotificationPannelComponent,
    SettingsPannelComponent,
    NotificationCardComponent,
    NotificationCardComponent,
  ],
  providers: [NotificationService, NotificationFacade],
})
export class NotificationModule {}
