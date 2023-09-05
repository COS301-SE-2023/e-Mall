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
@Component({
  selector: 'app-combo-popover',
  templateUrl: './combo-popover.component.html',
  styleUrls: ['./combo-popover.component.scss'],
})
export class ComboPopoverComponent implements OnInit {
  selectForm!: FormGroup;
  newForm!: FormGroup;
  newClicked: boolean = false;
  combos$!: Observable<ICombo[] | null>;
  product!: IProduct;
  userEmail!: string;
  username!: string | undefined;
  addEmails: string[] = [];

  constructor(
    private fb: FormBuilder,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private comboFacade: ComboFacade,
    private navParams: NavParams,
    private profileFacade: ProfileFacade
  ) {}

  ngOnInit() {
    this.profileFacade.getProfile().subscribe(data => {
      if (data) {
        this.userEmail = data.email;
        this.username = data.username;
      }
    });
    this.product = this.navParams.get('product');

    this.selectForm = this.fb.group({
      selectedOptions: [[]],
    });

    this.newForm = this.fb.group({
      newName: ['', Validators.required],
      newEmails: ['', [Validators.email]],
    });

    this.comboFacade.getCombos().subscribe(data => {
      if (data) this.combos$ = of(data);
    });
  }

  newClick() {
    this.newClicked = true;
  }

  createNewComboAndClearInput() {
    // Get the "newEmails" form control
    console.log('enter');
    const newEmailsControl = this.newForm.get('newEmails');

    // Check if the control exists and is not null or undefined
    if (newEmailsControl && newEmailsControl.valid) {
      console.log('here');
      // Push the value from the form control to your array (assuming "addEmails" is an array)
      this.addEmails.push(newEmailsControl.value);

      // Reset the "newEmails" form control to clear the input field
      newEmailsControl.reset();
    }
  }

  createNewCombo() {
    if (this.newForm.valid) {
      // Get form values
      const newName = this.newForm.value.newName;

      // Split emails into an array
      const useremailsarray = this.addEmails;
      useremailsarray.unshift(this.userEmail);

      // Create data object
      const data = {
        combo_name: newName,
        user_emails: useremailsarray,
        product_ids: [this.product.id], // You need to define 'this.product'
        username: [this.username], // You need to define 'this.username',
        product: this.product,
      };

      // Reset the form
      this.newForm.reset();

      // Call your 'addCombo' function with 'data'
      this.addCombo(data);
    }
  }

  UpdateExistingCombo() {
    if (this.selectForm.valid) {
      const data = {
        combo_ids: this.selectForm.value.selectedOptions,
        product_id: this.product.id,
        product: this.product,
      };
      this.updateCombo(data);
    }
  }

  updateCombo(data: any) {
    this.comboFacade.updateCombo(data);
    this.closePopover();
  }

  addCombo(data: any) {
    this.comboFacade.CreateCombo(data);
    this.closePopover();
  }
  async closePopover() {
    await this.modalController.dismiss();
  }
}
