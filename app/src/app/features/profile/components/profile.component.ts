import { Component } from '@angular/core';
import { ProfileFacade } from '../services/profile.facade';
import { ISellerProfile } from '../models/seller-profile.interface';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profile$: Observable<ISellerProfile | IConsumerProfile | null>;
  constructor(public profileFacade: ProfileFacade) {
    this.profile$ = this.profileFacade.getProfile();
  }
}
