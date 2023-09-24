import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-placeholder',
  templateUrl: './product-placeholder.component.html',
  styleUrls: ['./product-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPlaceholderComponent {

}
