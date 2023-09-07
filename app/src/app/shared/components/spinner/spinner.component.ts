import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '@shared/components/spinner/services/loader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SpinnerComponent{

  constructor(public loader: LoaderService) { }

  
}

