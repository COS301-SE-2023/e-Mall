import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu-modal',
    templateUrl: './menu-modal.component.html',
    styleUrls: ['./menu-modal.component.scss'],
  })
export class MenuModalComponent {
  constructor(private modalController: ModalController, private router: Router) {}

  async navigateToCategory(category: string) {
    await this.modalController.dismiss();
    this.router.navigate([category]);
  }

  closeMenuModal() {
    this.modalController.dismiss();
  }
}
