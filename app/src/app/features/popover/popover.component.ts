import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopovereditComponent } from '../popoveredit/popoveredit.component';
import { ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';


@Component({
    selector: 'app-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss'],
})




export class PopoverComponent {
    @Input() product: any;

    constructor(private popoverController: PopoverController) { }

    async presentPopover(ev: any) {
      const popover = await this.popoverController.create({
          component: PopovereditComponent,
          componentProps: { product: this.product },
          event: ev,
      });
      await popover.present();
      }

    editProduct() {
        // Implement the logic to navigate to the edit product page with the selected product's ID or other identifier
        this.popoverController.dismiss();
      }
    
      deleteProduct() {
        // Implement the logic to delete the selected product
        this.popoverController.dismiss();
      }

    closePopover() {
        this.popoverController.dismiss();
    }
}