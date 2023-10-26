import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthFacade } from '@app/features/auth/services/auth.facade';

@Component({
    selector: 'app-menu-modal',
    templateUrl: './menu-modal.component.html',
    styleUrls: ['./menu-modal.component.scss'],
  })
export class MenuModalComponent {
  constructor(private modalController: ModalController, private router: Router, private authFacade: AuthFacade,) {}

  async navigateToCategory(category: string) {
    await this.modalController.dismiss();
    this.router.navigate([category]);
  }

  closeMenuModal() {
    this.modalController.dismiss();
  }

  async combos(_event: Event) {
    if (await this.authFacade.isLoggedIn()) {
      await this.modalController.dismiss();
      this.router.navigate(['/my-collections']);
    } else {
      await this.modalController.dismiss();
      this.router.navigate(['/sign-in']);
    }
  }

  
}
