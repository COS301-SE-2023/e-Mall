import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: 'product-card.component.html',
  styleUrls: ['product-card.component.scss']
})
export class ProductCardComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() product: any;
}
