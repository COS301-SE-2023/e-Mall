/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController, ModalController } from '@ionic/angular';
import { ComboFacade } from '@features/combo-state/services/combo.facade';
import { ICombo } from '@features/combo-state/models/combo.interface';
import { Observable, of } from 'rxjs';
import { NavParams } from '@ionic/angular';
import { IProduct } from '@shared/models/product/product.interface';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-combo-invite',
  templateUrl: './combo-invite.component.html',
  styleUrls: ['./combo-invite.component.scss'],
})
export class ComboInviteComponent implements OnInit {
  selectForm!: FormGroup;
  newForm!: FormGroup;
  newClicked: boolean = false;
  combos$!: Observable<ICombo[] | null>;
  collection_id!: number;
  userEmail!: string;
  username!: string | undefined;
  comboEmail!: string;
  isChanged = false;

  addEmails: string[] = [];

  constructor(
    private fb: FormBuilder,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private comboFacade: ComboFacade,
    private navParams: NavParams,
    private profileFacade: ProfileFacade,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.profileFacade.getProfile().subscribe(data => {
      if (data) {
        this.userEmail = data.email;
        this.username = data.username;
      }
    });
    this.collection_id = this.navParams.get('collection_id');

    this.selectForm = this.fb.group({
      selectedOptions: [[]],
    });

    this.newForm = this.fb.group({
      newEmails: ['', [Validators.email]],
    });

    this.comboFacade.getCombos().subscribe(data => {
      if (data) this.combos$ = of(data);
    });
  }
  AddEmail() {
    const newEmailsControl = this.newForm.get('newEmails');
    if (newEmailsControl && newEmailsControl.valid) {
      if (newEmailsControl.value == this.userEmail) {
        //throw toast error message
        this.toastController
          .create({
            header: 'An error has occurred:',
            message: 'You cannot add your own email',
            duration: 2000,
            cssClass: 'error-toast',
          })
          .then(toast => {
            toast.present();
          });
        newEmailsControl.reset();
        return;
      } else if (
        newEmailsControl.value == '' ||
        newEmailsControl.value == null
      ) {
        this.toastController
          .create({
            header: 'An error has occurred:',
            message: 'Please enter an email',
            duration: 2000,
            cssClass: 'error-toast',
          })
          .then(toast => {
            toast.present();
          });
        newEmailsControl.reset();
        return;
      } else {
        this.addEmails.push(newEmailsControl.value);
      }
      newEmailsControl.reset();
      this.isChanged = true;
    }
  }

  editCombo() {
    if (this.newForm.valid) {
      const useremailsarray = this.addEmails;

      // Create data object
      const data = {
        collection_id: this.navParams.get('collection_id'),
        user_emails: useremailsarray,
      };

      // Reset the form
      this.newForm.reset();

      // Call your 'addCombo' function with 'data'
      this.updateCombo(data);
    }
  }

  updateCombo(data: any) {
    this.comboFacade.inviteUsers(data);
    this.closePopover();
  }

  async closePopover() {
    await this.modalController.dismiss();
  }

  onChange() {
    this.isChanged = true;
  }
  removeEmail(email: string) {
    this.addEmails = this.addEmails.filter(e => e !== email);
    if (this.addEmails.length == 0) {
      this.isChanged = false;
    }
  }
}
