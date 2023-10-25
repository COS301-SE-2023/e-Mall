import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { SearchBarComponent } from '../../search-bar/search-bar.component';

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