import { Component } from '@angular/core';
import { ComboFacade } from '../services/combo.facade';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-combo',
    templateUrl: './combo.component.html',
    styleUrls: ['./combo.component.scss'],
})
export class ComboComponent {
    comboForm: FormGroup;

    combo$: Observable<any | null>;
    constructor(public comboFacade: ComboFacade) {
        this.comboForm = new FormGroup({
            username: new FormControl(),
            email: new FormControl(),
        });
        this.combo$ = this.comboFacade.getCombo();
        // this.comboFacade()
    }
}
