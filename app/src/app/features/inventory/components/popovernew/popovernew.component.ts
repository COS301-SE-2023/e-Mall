import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { IInventoryItem } from '@features/inventory/models/inventory-item.interface';
import { InventoryFacade } from '@features/inventory/servicies/inventory.facade';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../servicies/inventory.service';
import { ProfileFacade } from '@app/features/profile/services/profile.facade';
import { ISellerProfile } from '@app/features/profile/models/seller-profile.interface';
import { IConsumerProfile } from '@app/features/profile/models/consumer-profile.interface';
import { Observable, Subscription, map, of } from 'rxjs';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-popovernew',
  templateUrl: './popovernew.component.html',
  styleUrls: ['./popovernew.component.scss'],
})
export class PopovernewComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef;
  file?: File;
  errorMessage?: string;

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
    private profileFacade: ProfileFacade,
    private router: Router
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
      price: [{ value: '0' }],
      discount: [
        '0',
        [Validators.min(0), Validators.max(100), Validators.required],
      ],
      stock: ['True'],
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
          this.similarProducts = response.body;
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    }
    this.nextClicked = true;
  }

  selectProd() {
    this.isSelected = true;
    this.newClicked = false;
    this.nextClicked = false;
  }

  backClick() {
    this.nextClicked = true;
    this.isSelected = false;
    this.newClicked = false;
  }
  home() {
    this.resetForm();
    this.router.navigate(['/inventory']);
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
    return this.productSellerForm.get(field)?.value;
  }

  getProdFormControlValue(field: string) {
    return this.productForm.get(field)?.value;
  }

  createExistingProduct() {
    const data = {
      seller_name: this.seller_name,
      product_name: this.SelectedProduct,
      price: this.getCurrPrice(),
      discount: this.getDiscAmount(),
      discount_rate: this.getDiscRate(),
      original_price: this.getFormControlValue('price'),
      product_url: this.getFormControlValue('url'),
      in_stock: this.getFormControlValue('stock'),
      img_array: this.getFormControlValue('imgs'),
    };
    this.inventoryFacade.addExistingProduct(data);
    this.router.navigate(['/inventory']);
    //clear the form
    this.resetForm();
  }

  createNewProduct() {
    const data = {
      seller_name: this.seller_name,
      name: this.getProdFormControlValue('name'),
      brand: this.getProdFormControlValue('brand'),
      category: this.getProdFormControlValue('category'),
      description: this.getProdFormControlValue('description'),
      //prodseller details
      price: this.getCurrPrice(),
      discount: this.getDiscAmount(),
      discount_rate: this.getDiscRate(),
      original_price: this.getFormControlValue('price'),
      product_url: this.getFormControlValue('url'),
      in_stock: this.getFormControlValue('stock'),
      img_array: this.getFormControlValue('imgs'),
    };
    //call the inventory facade and wait for it before navigating back to product page
    this.inventoryFacade.newProduct(data);
    this.router.navigate(['/inventory']);
    //clear the form
    this.resetForm();
  }
  getDiscRate() {
    return this.getFormControlValue('discount') / 100.0;
  }
  getDiscAmount() {
    return this.getDiscRate() * this.getFormControlValue('price');
  }

  getCurrPrice() {
    return this.getFormControlValue('price') - this.getDiscAmount();
  }
  resetForm() {
    this.nameForm.reset();
    this.productForm.reset();
    this.productSellerForm.reset();
    this.newClicked = false;
    this.nextClicked = false;
    this.isSelected = false;
  }
  async download() {
    const data = await this.inventoryFacade.downloadFile();
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'format.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    const file = files[0];
    console.log(1);
    if (file.name.split('.').pop() !== 'xlsx' && this.fileInput) {
      this.errorMessage = 'Invalid extension! Only .xlsx files are allowed.';
      this.fileInput.nativeElement.value = '';
      console.log(2);
    } else {
      this.file = file;
      this.errorMessage = '';
      console.log(3);
    }
  }
  async uploadFile() {
    console.log(4);

    if (!this.file) {
      console.log(5);
      this.errorMessage = 'Please select a file.';
      return;
    }
    const reader = new FileReader();
    console.log(55);

    reader.onload = async (event: any) => {
      console.log(77);

      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      let range = { s: { c: 1, r: 2 }, e: { c: 10, r: 301 } }; // 0-indexed

      // Convert the range of cells to JSON
      let jsonData = XLSX.utils.sheet_to_json(worksheet, {
        range: range,
        header: 1,
      });
      // Remove empty rows
      jsonData = jsonData.filter((row: any) =>
        row.some((cell: any) => cell !== null && cell !== '')
      );

      console.log(jsonData);

      try {
        await this.inventoryFacade.uploadBulkData(jsonData);
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Failed to send data.';
      }
    };
    reader.readAsArrayBuffer(this.file);
  }
}
