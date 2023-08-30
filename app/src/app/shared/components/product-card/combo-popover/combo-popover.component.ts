/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-combo-popover',
  templateUrl: './combo-popover.component.html', 
  styleUrls: ['./combo-popover.component.scss'], 
})
export class ComboPopoverComponent implements OnInit {
  productForm!: FormGroup;
  newProductForm!: FormGroup;
  newClicked: boolean = false;

  constructor(private fb: FormBuilder,  private popoverController: PopoverController,
    private modalController: ModalController) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      selectedOptions: [[]], // Empty array for multiple selection
    });

    this.newProductForm = this.fb.group({
      newProductName: ['', Validators.required],
      newProductEmail: ['', [Validators.required, Validators.email]],
    });
  }

  newClick() {
    this.newClicked = true;
  }

  createNewCombo() {
    if (this.newProductForm.valid) {
      const newName = this.newProductForm.value.newProductName;
      const newEmail = this.newProductForm.value.newProductEmail;
      this.newProductForm.reset();
      this.newClicked = false;
    }
    this.addCombo();
  }

  addCombo(){
    this.closePopover();
  }
    async closePopover() {
        await this.popoverController.dismiss();
      }
  
  
  
}
