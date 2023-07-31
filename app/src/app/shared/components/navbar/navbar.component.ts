/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthFacade } from '@app/features/auth/services/auth.facade';
import { IUser } from '@app/features/auth/models/user.interface';
import { Observable } from 'rxjs';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { PopoverController } from '@ionic/angular';
import { DropdownPopoverComponent } from '@shared/components/dropdown-popover/dropdown-popover.component';
import { ModalController } from '@ionic/angular';
import { NavbarPopupComponent } from '@shared/components/navbar-popup/navbar-popup.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isAuthenticated: Observable<IUser | null>;
  isCategoryOpened = false;
  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private profileFacde: ProfileFacade,
    private popoverController: PopoverController,
    public modalController: ModalController
  ) {
    this.isAuthenticated = this.authFacade.getCurrentUser();
  }

  search(searchQuery: string): void {
    // Create the navigation extras object with the search query as a parameter
    const navigationextras: NavigationExtras = {
      queryParams: { search: searchQuery },
    };

    this.router.navigate(['/search-results'], navigationextras);
  }
  async toggleCategory(event: Event) {
    const popover = await this.popoverController.create({
      component: DropdownPopoverComponent,
      event: event,
      translucent: true,
      animated: true,
      componentProps: {
        parameterData: 'Cat',
      },
    });
    return await popover.present();
  }
  async toggleSellers(event: Event) {
    const popover = await this.popoverController.create({
      component: DropdownPopoverComponent,
      event: event,
      translucent: true,
      animated: true,
      componentProps: {
        parameterData: 'Sel',
      },
    });
    return await popover.present();
  }

  async wishlist(event: Event) {
    if (await this.authFacade.isLoggedIn()) {
      this.router.navigate(['/wishlist']);
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

  public signIn(): void {
    this.router.navigate(['sign-in']);
  }
  public signOut(): void {
    this.router.navigate(['sign-out']);
  }

  public redirect(page: string): void {
    this.router.navigate([`/${page}`]);
  }

  async openPopover(event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: NavbarPopupComponent,
      /* componentProps: {
        product: product,
      }, */
      //mode: 'ios',
      cssClass: 'inventory-popover',
      showBackdrop: true,
      backdropDismiss: true,
      event: event,
      translucent: true,
    });
    return await popover.present();
  }
}
