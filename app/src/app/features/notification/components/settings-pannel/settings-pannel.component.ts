/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationFacade } from '../../services/notification.facade';
import { take, debounceTime } from 'rxjs';
import { INotificationSettings } from '../../models/notification-settings.interface';

@Component({
  selector: 'app-settings-pannel',
  templateUrl: './settings-pannel.component.html',
  styleUrls: ['./settings-pannel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPannelComponent {
  settings: INotificationSettings = {
    all: false,
    general: false,
    following: false,
    wishlist: false,
  };
  previousSettings!: INotificationSettings;
  isNotChanged = true;

  constructor(public notificationFacade: NotificationFacade) {
    notificationFacade.settings$
      .pipe(take(1), debounceTime(100))
      .subscribe((val: INotificationSettings) => {
        this.settings.all = val.all;
        this.settings.general = val.general;
        this.settings.following = val.following;
        this.settings.wishlist = val.wishlist;
        this.previousSettings = { ...this.settings };
      });
  }
  onToggleChange(event: any, key: keyof INotificationSettings) {
    const isChecked = event.detail.checked;

    if (key === 'all') {
      this.settings = {
        all: isChecked,
        general: isChecked,
        following: isChecked,
        wishlist: isChecked,
      };
    } else {
      this.settings[key as keyof INotificationSettings] = isChecked;
      const allOtherSettingsAreTrue = Object.keys(this.settings)
        .filter(settingKey => settingKey !== 'all')
        .every(
          settingKey => this.settings[settingKey as keyof INotificationSettings]
        );

      if (allOtherSettingsAreTrue) {
        this.settings.all = true;
      } else if (!isChecked) {
        this.settings.all = false;
      }
    }
    this.isNotChanged =
      JSON.stringify(this.settings) === JSON.stringify(this.previousSettings);
  }

  async saveSettings() {
    this.notificationFacade.isLoading.next(true);
    this.previousSettings = { ...this.settings };
    this.isNotChanged = true;
    await this.notificationFacade.updateSettings(this.settings);
    this.notificationFacade.isLoading.next(false);
  }
}
