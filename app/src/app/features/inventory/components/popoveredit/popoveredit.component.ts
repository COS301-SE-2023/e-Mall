/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { IInventoryItem } from '@features/inventory/models/inventory-item.interface';
import { InventoryFacade } from '@features/inventory/servicies/inventory.facade';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-popoveredit',
  templateUrl: './popoveredit.component.html',
  styleUrls: ['./popoveredit.component.scss'],
})
export class PopovereditComponent implements OnInit {
  @Input() product!: IInventoryItem;
  editClicked = false;
  productForm!: FormGroup;

  constructor(
    private popoverController: PopoverController,
    private inventoryFacade: InventoryFacade,
    private modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: [{ value: '', disabled: true }],
      price: [{ value: '0.00', disabled: true }],
      discount: [
        '0.00',
        [Validators.min(0), Validators.max(100), Validators.required],
      ],
      stock: ['in'],
    });
  }

  ngOnInit() {
    if (this.product.original_price)
      this.setFormControlValue('price', this.product.original_price.toString());
    if (this.product.discount_rate)
      this.setFormControlValue(
        'discount',
        (this.product.discount_rate * 100).toFixed(2)
      );
    if (this.product.product_name)
      this.setFormControlValue('name', this.product.product_name);
    if (this.product.product_category) {
      this.setFormControlValue(
        'category',
        this.product.product_category.charAt(0).toUpperCase() +
          this.product.product_category.slice(1)
      );
    }
    if (this.product.in_stock !== undefined) {
      if (!this.product.in_stock) {
        this.setFormControlValue('stock', 'out');
      }
    }
  }
  closeModal() {
    this.modalController.dismiss();
  }
  editClick() {
    this.editClicked = true;
  }

  saveChanges() {
    if (this.productForm.valid) {
      const data: IInventoryItem = {
        id: this.product.id,
        product_name: this.getFormControlValue('name'),
        original_price: +Number(this.getFormControlValue('price')).toFixed(2),
        product_category: this.getFormControlValue('category'),
        discount_rate: +Number(
          this.getFormControlValue('discount') / 100
        ).toFixed(2),
        in_stock: this.getFormControlValue('stock') === 'in',
      };
      if (!this.areEqual(this.product, data)) {
        return [
          this.inventoryFacade.updateItem(data),
          this.modalController.dismiss(),
        ];
      } else {
        return this.modalController.dismiss();
      }
    }
    return;
  }
  areEqual(item1: IInventoryItem, item2: IInventoryItem): boolean {
    return (
      item1.product_name === item2.product_name &&
      Number(item1.discount_rate) === Number(item2.discount_rate) &&
      item1.in_stock === item2.in_stock
    );
  }
  deleteProduct() {
    const data: IInventoryItem = {
      id: this.product.id,
    };
    return [
      this.inventoryFacade.removeItem(data),
      this.modalController.dismiss(),
    ];
  }
  formatNumber(e: any, val: string) {
    const separator = '.';
    const decimais = 2;
    if (!e.detail.value) return '';
    let [num, decimal] = e.detail.value.split(separator);
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
    return this.productForm.get(field)?.value;
  }
}
