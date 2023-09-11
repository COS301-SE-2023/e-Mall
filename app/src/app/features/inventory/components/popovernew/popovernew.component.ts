import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { IInventoryItem } from '@features/inventory/models/inventory-item.interface';
import { InventoryFacade } from '@features/inventory/servicies/inventory.facade';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-popovernew',
  templateUrl: './popovernew.component.html',
  styleUrls: ['./popovernew.component.scss'],
})
export class PopovernewComponent implements OnInit {
    
  newClicked = false;
  selectForm!: FormGroup;
  nextClicked=false;
  
  newForm!: FormGroup;
    constructor(
        private popoverController: PopoverController,
        private inventoryFacade: InventoryFacade,
        private modalController: ModalController,
        private fb: FormBuilder
      ) {}
    ngOnInit(): void {
        console.log("New product")
    }
    closeModal() {
        this.modalController.dismiss();
      }

      newClick() {
        this.newClicked = true;
      }
      nextClick(){
        this.nextClicked=!this.nextClicked;
      }
      Done(){
        console.log("Done")
      }
}