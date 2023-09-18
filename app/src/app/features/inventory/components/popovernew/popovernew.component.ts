import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { IInventoryItem } from '@features/inventory/models/inventory-item.interface';
import { InventoryFacade } from '@features/inventory/servicies/inventory.facade';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../servicies/inventory.service';
import { ProfileFacade } from '@app/features/profile/services/profile.facade';
import { ISellerProfile } from '@app/features/profile/models/seller-profile.interface';
import { IConsumerProfile } from '@app/features/profile/models/consumer-profile.interface';
import { Observable, Subscription, map, of } from 'rxjs';

@Component({
  selector: 'app-popovernew',
  templateUrl: './popovernew.component.html',
  styleUrls: ['./popovernew.component.scss'],
})
export class PopovernewComponent implements OnInit {
  newClicked = false;
  SelectedProduct!: string;
  selectForm!: FormGroup;
  nextClicked = false;
  similarProducts!: any;
  nameForm!: FormGroup;
  isSelected = false;
  productForm!: FormGroup;
  productSellerForm!: FormGroup;
  categories: string[] = [
    'Books',
    'Clothing',
    'Electronics',
    'Health and Beauty',
    'Home and Kitchen',
    'Sports and Outdoors',
    'Toys and Games',
  ];
  profile$!: Observable<ISellerProfile | IConsumerProfile | null>;
  seller_name: string | undefined;

  constructor(
    private popoverController: PopoverController,
    private inventoryFacade: InventoryFacade,
    private modalController: ModalController,
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private profileFacade: ProfileFacade
  ) {}
  ngOnInit(): void {
    this.profile$ = this.profileFacade.getProfile();
    this.profile$.subscribe(profile => {
      if (profile) {
        this.seller_name = profile.username;
      }
    });
    this.nameForm = this.fb.group({
      newName: ['', Validators.required],
    });
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: [{ value: '' }, [Validators.required]],
      brand: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.productSellerForm = this.fb.group({
      productSeller: ['', [Validators.required, Validators.minLength(2)]],
      price: [{ value: '0.00' }],
      discount: [
        '0.00',
        [Validators.min(0), Validators.max(100), Validators.required],
      ],
      stock: ['in'],
      url: ['', [Validators.required]],
      imgs: [''],
    });
  }
  closeModal() {
    this.modalController.dismiss();
  }

  newClick() {
    this.newClicked = true;
    this.nextClicked = false;
    this.isSelected = false;
  }
  nextClick() {
    if (this.nameForm.valid) {
      const newname = this.nameForm.value.newName;
      const data = {
        name: newname,
      };
      this.inventoryService.getSimilarProducts(data).then(
        response => {
          // Handle the successful response here
          this.similarProducts = response.body; // Access the response body
        },
        (error: any) => {
          // Handle any errors that occur during the request
          console.error('Error:', error);
        }
      );
    }
    this.nextClicked = true;
  }

  selectProd() {
    console.log(this.SelectedProduct);
    this.isSelected = true;
    this.newClicked = false;
    this.nextClicked = false;
  }

  backClick() {
    this.nextClicked = false;
    this.isSelected = false;
    this.newClicked = false;
  }
  NewProduct() {
    console;
  }

  formatNumber(e: any, val: string) {
    const separator = '.';
    const decimais = 2;
    if (!e.detail.value) return '';

    let [num, decimal] = e.detail.value.split(separator);
    console.log(num, decimal);

    num = num.toLocaleString();

    if (decimal) {
      decimal = decimal.toString().padEnd(decimais, '0');
    } else {
      decimal = '00';
    }
    const ret = num + '.' + decimal;
    if (val === 'price') {
      return this.setFormControlValue('price', ret);
    } else if (val === 'discount') {
      return this.setFormControlValue('discount', ret);
    }
  }

  getFormControl(field: string) {
    return this.productForm.get(field);
  }
  setFormControlValue(field: string, value: any) {
    this.productForm.get(field)?.setValue(value);
  }
  getFormControlValue(field: string) {
    return this.productSellerForm.get(field)?.value;
  }

  getProdFormControlValue(field: string) {
    return this.productForm.get(field)?.value;
  }


  Done() {
    console.log('Done');
  }
  createExistingProduct() {
    const data = {
      seller_name: this.seller_name,
      product_name: this.SelectedProduct,
      price: this.getFormControlValue('price'),
      discount: this.getFormControlValue('discount'),
      discount_rate: this.getFormControlValue('discount'),
      original_price: this.getFormControlValue('price'),
      product_url: this.getFormControlValue('url'),
      in_stock: this.getFormControlValue('stock'),
      img_array: this.getFormControlValue('imgs'),
    };
    console.log(data);
     this.inventoryFacade.addExistingProduct(data);
  }

  createNewProduct() {
    const data = {
      seller_name: this.seller_name,
      name: this.getProdFormControlValue('name'),
      brand: this.getProdFormControlValue('brand'),
      category: this.getProdFormControlValue('category'),
      description: this.getProdFormControlValue('description'),
      //prodseller details
      price: this.getFormControlValue('price'),
      discount: this.getFormControlValue('discount'),
      discount_rate: this.getFormControlValue('discount'),
      original_price: this.getFormControlValue('price'),
      product_url: this.getFormControlValue('url'),
      in_stock: this.getFormControlValue('stock'),
      img_array: this.getFormControlValue('imgs'),
    };
    console.log(data);
    //this.inventoryFacade.newProduct(data);
  }
}
