import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { ISellerProfile } from '@features/profile/models/seller-profile.interface';
import { IConsumerProfile } from '@features/profile/models/consumer-profile.interface';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthFacade } from '@features/auth/services/auth.facade';

@Component({
  selector: 'app-navbar-popup',
  templateUrl: './navbar-popup.component.html',
  styleUrls: ['./navbar-popup.component.scss'],
})
export class NavbarPopupComponent {
  profileForm: FormGroup;

  profile$: Observable<ISellerProfile | IConsumerProfile | null>;

  constructor(
    private authFacade: AuthFacade,
    private popoverController: PopoverController,
    private router: Router,
    public profileFacade: ProfileFacade
  ) {
    this.profileForm = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
    });
    this.profile$ = this.profileFacade.getProfile();
  }

  closePopOver() {
    this.popoverController.dismiss();
  }

  goToCustomerProfile() {
    this.router.navigate(['/customer-profile']);
    this.popoverController.dismiss();
  }

  async signOut(): Promise<void> {
    this.popoverController.dismiss();
    await this.authFacade.signOut();
    window.location.reload();
  }
}
