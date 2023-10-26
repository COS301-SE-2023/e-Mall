import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent {
  constructor(private modalController: ModalController) {}

  closeMenuModal() {
    this.modalController.dismiss();
  }
}
