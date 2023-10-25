import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search-modal',
    templateUrl: './search-modal.component.html',
    styleUrls: ['./search-modal.component.scss'],
  })
export class SearchModalComponent {
  constructor(private modalController: ModalController, private router: Router) {}

  closeMenuModal() {
    this.modalController.dismiss();
  }
}