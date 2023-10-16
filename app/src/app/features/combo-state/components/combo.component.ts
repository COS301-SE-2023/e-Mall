/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ComboFacade } from '../services/combo.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.scss'],
})
export class ComboComponent {
  combo$: Observable<any>;
  constructor(public comboFacade: ComboFacade) {
    this.combo$ = this.comboFacade.getCombos();
    // this.comboFacade()
  }
}
