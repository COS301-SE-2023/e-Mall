import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
    selector: 'app-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss'],
})

export class PopoverComponent {
    @Input() product: any;

    constructor(private popoverController: PopoverController) { }

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