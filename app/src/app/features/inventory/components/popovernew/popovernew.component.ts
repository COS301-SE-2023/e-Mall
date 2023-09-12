import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { IInventoryItem } from '@features/inventory/models/inventory-item.interface';
import { InventoryFacade } from '@features/inventory/servicies/inventory.facade';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../servicies/inventory.service';
@Component({
  selector: 'app-popovernew',
  templateUrl: './popovernew.component.html',
  styleUrls: ['./popovernew.component.scss'],
})
export class PopovernewComponent implements OnInit {
    
  newClicked = false;
  selectForm!: FormGroup;
  nextClicked=false;
  similarProducts!: any;
  nameForm!:FormGroup;
  
  newForm!: FormGroup;
    constructor(
        private popoverController: PopoverController,
        private inventoryFacade: InventoryFacade,
        private modalController: ModalController,
        private fb: FormBuilder,
        private inventoryService: InventoryService
      ) {}
    ngOnInit(): void {
        console.log("New product")
        this.nameForm=this.fb.group({
          newName:['',Validators.required],
        });
    }
    closeModal() {
        this.modalController.dismiss();
      }

      newClick() {
        this.newClicked = true;
      }
      nextClick(){
        if(this.nameForm.valid){
          const newname=this.nameForm.value.newName;
          console.log(newname)
        const data={
          name: newname
        }
        console.log(data)
        this.similarProducts = this.inventoryService.getSimilarProducts(data);
        console.log(this.similarProducts)
        this.nextClicked=true;
      }
    }
      Done(){
        console.log("Done")
      }
}