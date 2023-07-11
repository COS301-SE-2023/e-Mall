import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
    selector: 'app-popoveredit',
    templateUrl: './popoveredit.component.html',
    styleUrls: ['./popoveredit.component.scss'],
})

export class PopovereditComponent {
    @Input() product: any;
    constructor(private popoverController: PopoverController) {}

    saveChanges() {
    // Perform any necessary logic or API calls to save the changes
    this.popoverController.dismiss();
    }

    cancelEdit() {
    this.popoverController.dismiss();
    }


}