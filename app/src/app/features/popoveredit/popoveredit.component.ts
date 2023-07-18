import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ProductSellerService } from '@shared/servicies/productseller/productseller.service';
import { ProfileFacade } from '@features/profile/services/profile.facade';
@Component({
  selector: 'app-popoveredit',
  templateUrl: './popoveredit.component.html',
  styleUrls: ['./popoveredit.component.scss'],
})
export class PopovereditComponent {
  @Input() product: any;
  seller_name!: string | undefined;
  name!: string;
  original_price!: number;
  discount_rate!: number;
  inventory_status!: boolean;
  constructor(
    private popoverController: PopoverController,
    private ProductSellerService: ProductSellerService,
    private profileFacade: ProfileFacade
  ) {}

  ngOnInit() {
    this.profileFacade.getProfile().subscribe(profile => {
      if (profile) {
        if ('business_name' in profile.details) {
          console.log(profile.details.business_name);
          this.seller_name = profile.details.business_name;
        }
      }
    });
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
    location.reload();
    this.popoverController.dismiss();
  }

  deleteProduct() {
    // Implement the logic to delete the selected product
    const data = {
      prod_id: this.product.product,
      seller_name: this.seller_name,
    };
    console.log(data);
    this.ProductSellerService.deleteProductSellerData(data);
    location.reload();
    this.popoverController.dismiss();
  }
}
