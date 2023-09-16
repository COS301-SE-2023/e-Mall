import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent {
  
  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
  
}
