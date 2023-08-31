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
  selectForm!: FormGroup;
  newForm!: FormGroup;
  newClicked: boolean = false;

  constructor(private fb: FormBuilder,  private popoverController: PopoverController,
    private modalController: ModalController) {}

  ngOnInit() {
    this.selectForm = this.fb.group({
      selectedOptions: [[]],
    });

    this.newForm = this.fb.group({
      newName: ['', Validators.required],
      newEmail: ['', [Validators.required, Validators.email]],
    });
  }

  newClick() {
    this.newClicked = true;
  }

  createNewCombo() {
    if (this.newForm.valid) {
      const newName = this.newForm.value.newProductName;
      const newEmail = this.newForm.value.newProductEmail;
      this.newForm.reset();
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
