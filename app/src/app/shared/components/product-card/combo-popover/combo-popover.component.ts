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
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';

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
  consumer_email!: string;

  constructor(
    private fb: FormBuilder,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private comboFacade: ComboFacade,
    private navParams: NavParams,
    private profileFacade: ProfileFacade,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    this.profileFacade.getProfile().subscribe(data => {
      if (data) {
        this.userEmail = data.email;
        this.username = data.username;
      }
    });
    this.product = this.navParams.get('product');
    this.consumer_email = this.navParams.get('consumer_email');

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

      // Create data object
      const data = {
        current_user_email: this.userEmail,
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
      if (this.selectForm.value.selectedOptions[0] == 'wishlist') {
        this.favClickAnalytics();
        this.profileFacade.toggleWishlist(this.product.id);

        if (this.selectForm.value.selectedOptions.length > 1) {
          const options = this.selectForm.value.selectedOptions.slice(1);
          const data = {
            combo_ids: options,
            product_id: this.product.id,
            product: this.product,
          };
          this.updateCombo(data);
        }
        this.closePopover();
      } else {
        const data = {
          combo_ids: this.selectForm.value.selectedOptions,
          product_id: this.product.id,
          product: this.product,
        };
        this.updateCombo(data);
        this.closePopover();
      }
    }
  }

  updateCombo(data: any) {
    this.comboFacade.updateCombo(data);
  }

  addCombo(data: any) {
    this.comboFacade.CreateCombo(data);
    this.closePopover();
  }
  async closePopover() {
    await this.modalController.dismiss();
  }

  favClickAnalytics(): void {
    if (this.product) {
      const data = {
        seller: this.product.min_price_seller_business_name,
        product: this.product.name,
        product_category: this.product.category,
        consumer_email: this.consumer_email,
        event_type: 'favourited_product',
        metadata: null,
      };
      this.analytics.createAnalyticsData(data);
    }
  }
}
