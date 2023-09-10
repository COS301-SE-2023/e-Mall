import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings-pannel',
  templateUrl: './settings-pannel.component.html',
  styleUrls: ['./settings-pannel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPannelComponent {}
