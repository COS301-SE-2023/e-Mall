/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthFacade } from '@app/features/auth/services/auth.facade';
import { IUser } from '@app/features/auth/models/user.interface';
import { Observable, Subscription, debounceTime } from 'rxjs';
import { MenuController, PopoverController } from '@ionic/angular';
import { DropdownPopoverComponent } from '@shared/components/dropdown-popover/dropdown-popover.component';
import { NavbarPopupComponent } from '@shared/components/navbar-popup/navbar-popup.component';
import { NotificationFacade } from '@features/notification/services/notification.facade';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  isAuthenticated: Observable<IUser | null>;
  isCategoryOpened = false;
  notificationUnreadCount$: Observable<number>;
  notificationMenuSubs = new Subscription();

  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private popoverController: PopoverController,
    private menuController: MenuController,
    public notificationFacade: NotificationFacade
  ) {
    this.isAuthenticated = this.authFacade.getCurrentUser();

    this.notificationUnreadCount$ = this.notificationFacade.unread_count$;
    this.notificationMenuSubs = this.notificationFacade.isMenuOpen$
      .pipe(debounceTime(100))
      .subscribe(async val => {
        if (val === true) {
          this.notificationFacade.getNotifications();
          await this.menuController.enable(true, 'notification');
          await this.menuController.open('notification');
        } else if (await this.menuController.isOpen('notification')) {
          await this.menuController.close('notification');
        }
      });
  }
  ngOnDestroy(): void {
    this.notificationMenuSubs.unsubscribe();
  }

  search(searchQuery: string): void {
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

  async combos(_event: Event) {
    if (await this.authFacade.isLoggedIn()) {
      this.router.navigate(['/my-collections']);
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

  public signIn(): void {
    this.router.navigate(['sign-in']);
  }
  public signUp(): void {
    this.router.navigate(['sign-up']);
  }
  public signOut(): void {
    this.authFacade.signOut();
  }

  public redirect(page: string): void {
    this.router.navigate([page]);
  }

  async openPopover(event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: NavbarPopupComponent,
      cssClass: 'inventory-popover',
      showBackdrop: true,
      backdropDismiss: true,
      event: event,
      translucent: true,
    });
    return await popover.present();
  }

  async openMenu() {
    this.notificationFacade.isMenuOpen$.next(true);
  }
  notificationMenuClosed() {
    this.notificationFacade.isMenuOpen$.next(false);
  }
}
