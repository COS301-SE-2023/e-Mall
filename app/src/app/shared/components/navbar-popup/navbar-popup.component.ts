import { Component } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-popup',
  templateUrl: './navbar-popup.component.html',
  styleUrls: ['./navbar-popup.component.scss']
})
export class NavbarPopupComponent {

  constructor(private modalController: ModalController, private router: Router){}

  closeModal() {
    this.modalController.dismiss();
  }

  goToCustomerProfile() {
    
    this.router.navigate(['/customer-profile']);
    this.modalController.dismiss();
  }

  public signOut(): void {
    this.router.navigate(['sign-out']);
    this.modalController.dismiss();
  }
}
