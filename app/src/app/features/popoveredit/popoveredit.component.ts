import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ProductSellerService } from '@shared/servicies/productseller/productseller.service';

@Component({
  selector: 'app-popoveredit',
  templateUrl: './popoveredit.component.html',
  styleUrls: ['./popoveredit.component.scss'],
})
export class PopovereditComponent {
  @Input() product: any;
  seller_name!: string;
  name!: string;
  original_price!: number;
  discount_rate!: number;
  inventory_status!: boolean;
  constructor(
    private popoverController: PopoverController,
    private ProductSellerService: ProductSellerService
  ) {}

  ngOnInit() {
    this.seller_name = 'Takealot';
    this.name = this.product.product_name;
    this.original_price = this.product.original_price;
    this.discount_rate = this.product.discount_rate;
    this.inventory_status = this.product.in_stock;
  }

  saveChanges() {
    const data = {
      prod_id: this.product.product,
      seller_name: this.seller_name,
      product_name: this.name,
      original_price: this.original_price,
      discount_rate: this.discount_rate,
      in_stock: this.inventory_status,
    };
    this.ProductSellerService.updateProductSellerData(data);
    this.popoverController.dismiss();
  }

  cancelEdit() {
    this.popoverController.dismiss();
  }
}
