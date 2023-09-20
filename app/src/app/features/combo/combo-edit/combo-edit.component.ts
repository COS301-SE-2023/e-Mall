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
  selector: 'app-combo-edit',
  templateUrl: './combo-edit.component.html',
  styleUrls: ['./combo-edit.component.scss'],
})
export class ComboEditComponent implements OnInit {
  selectForm!: FormGroup;
  newForm!: FormGroup;
  newClicked: boolean = false;
  combos$!: Observable<ICombo[] | null>;
  collection_id!: number;
  userEmail!: string;
  username!: string | undefined;
  comboName!: string;
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
    this.comboName = this.navParams.get('combo_name');

    this.selectForm = this.fb.group({
      selectedOptions: [[]],
    });

    this.newForm = this.fb.group({
      newName: [this.comboName, Validators.required],
    });

    this.comboFacade.getCombos().subscribe(data => {
      if (data) this.combos$ = of(data);
    });
  }

  editCombo() {
    if (this.newForm.valid) {
      const newName = this.newForm.value.newName;
      const data = {
        collection_id: this.navParams.get('collection_id'),
        combo_name: newName,
      };

      // Reset the form
      this.newForm.reset();

      // Call your 'addCombo' function with 'data'
      this.updateCombo(data);
    } else {
      this.toastController
        .create({
          header: 'An error has occurred:',
          message: 'Combo name cannot be empty',
          duration: 2000,
          cssClass: 'error-toast',
        })
        .then(toast => toast.present());
    }
  }

  updateCombo(data: any) {
    this.comboFacade.editCombo(data);
    this.closePopover();
  }

  async closePopover() {
    await this.modalController.dismiss();
  }

  onChange() {
    this.isChanged = true;
  }
}
