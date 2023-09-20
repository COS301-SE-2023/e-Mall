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
import { SettingsPannelComponent as NotificationSettingsPannelComponent } from './components/settings-pannel/settings-pannel.component';
import { FormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { environment } from 'environments/env';

@NgModule({
  declarations: [
    NotificationComponent,
    NotificationPannelComponent,
    NotificationCardComponent,
    NotificationSettingsPannelComponent,
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([NotificationState]),
    IonicModule,
    ScrollingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideMessaging(() => getMessaging()),
  ],
  exports: [
    NotificationComponent,
    NotificationPannelComponent,
    NotificationSettingsPannelComponent,
    NotificationCardComponent,
  ],
  providers: [NotificationService, NotificationFacade],
})
export class NotificationModule {}
