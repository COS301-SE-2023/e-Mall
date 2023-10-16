import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InventoryFacade } from '@features/inventory/servicies/inventory.facade';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISellerProfile } from '@app/features/profile/models/seller-profile.interface';
import { IConsumerProfile } from '@app/features/profile/models/consumer-profile.interface';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { animate, style, transition, trigger } from '@angular/animations';
import { HostListener } from '@angular/core';
import { UrlValidator } from '@app/shared/validators/urlValidator';
@Component({
  selector: 'app-popovernew',
  templateUrl: './popovernew.component.html',
  styleUrls: ['./popovernew.component.scss'],
  animations: [
    trigger('initFadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      // transition(':leave', [animate(500, style({ opacity: 0 }))]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(100, style({ opacity: 0 }))]),
    ]),
  ],
})
export class PopovernewComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput?: ElementRef;
  file?: File;
  errorMessage?: string;

  newClicked = false;
  SelectedProduct!: string;
  selectForm!: FormGroup;
  nextClicked = false;
  similarProducts!: any;
  nameForm!: FormGroup;
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

  newProducts$: Observable<any>;
  nextPage = false;
  isExisting = false;
  isSelected = false;
  isDropdownOpen = false;
  inputSubject$ = new Subject<string>();
  inputSubscription = new Subscription();
  isSearching = true;
  resultPage = false;
  @Input() type!: string; // Access the passed parameter
  constructor(
    // private popoverController: PopoverController,
    private inventoryFacade: InventoryFacade,
    private modalController: ModalController,
    private fb: FormBuilder,
    // private inventoryService: InventoryService,
    // private profileFacade: ProfileFacade,
    private router: Router
  ) {
    this.newProducts$ = inventoryFacade.newProducts$;
  }

  ngOnInit(): void {
    // console.log(this.type);
    // this.profile$ = this.profileFacade.getProfile();
    // this.profile$.subscribe(profile => {
    //   if (profile) {
    //     this.seller_name = profile.username;
    //   }
    // });
    this.inputSubscription = this.inputSubject$
      .pipe(debounceTime(500))
      .subscribe(async (val: string) => {
        if (val.length > 1) {
          this.isSearching = true;
          await this.inventoryFacade.getSimilarProducts(val).then(result => {
            console.log(result);
            this.similarProducts = result;
            this.isSearching = false;
          });
        }
      });
    this.nameForm = this.fb.group({
      newName: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.productForm = this.fb.group({
      category: [{ value: '' }, [Validators.required]],
      brand: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.productSellerForm = this.fb.group({
      // productSeller: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.min(0), Validators.required]],
      discount: [
        '',
        [Validators.min(0), Validators.max(99), Validators.required],
      ],
      stock: ['True'],
      url: ['', [Validators.required, UrlValidator]],
      imgs: ['', [UrlValidator]],
    });
  }
  ngOnDestroy(): void {
    this.inputSubscription.unsubscribe();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  newClick() {
    this.newClicked = true;
    this.nextClicked = false;
    this.isSelected = false;
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
  // home() {
  //   // this.resetForm();
  //   this.router.navigate(['/inventory']);
  // }

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
      return this.setFormControlValue(this.productForm, 'price', ret);
    } else if (val === 'discount') {
      return this.setFormControlValue(this.productForm, 'discount', ret);
    }
  }

  setFormControlValue(controller: FormGroup, field: string, value: any) {
    controller.get(field)?.setValue(value);
  }
  getFormControlValue(contoller: FormGroup, field: string) {
    return contoller.get(field)?.value;
  }

  createExistingProduct() {
    const data = {
      seller_name: this.seller_name,
      product_name: this.getFormControlValue(this.nameForm, 'newName'),
      price: this.getCurrPrice(),
      discount: this.getDiscAmount(),
      discount_rate: this.getDiscRate(),
      original_price: this.getFormControlValue(this.productSellerForm, 'price'),
      product_url: this.getFormControlValue(this.productSellerForm, 'url'),
      in_stock: this.getFormControlValue(this.productSellerForm, 'stock'),
      img_array: this.getFormControlValue(this.productSellerForm, 'imgs'),
    };
    this.inventoryFacade.addExistingProduct(data);
    this.router.navigate(['/inventory']);
    //clear the form
    // this.resetForm();
  }

  createNewProduct() {
    const data = {
      seller_name: this.seller_name,
      name: this.getFormControlValue(this.nameForm, 'newName'),
      brand: this.getFormControlValue(this.productForm, 'brand'),
      category: this.getFormControlValue(this.productForm, 'category'),
      description: this.getFormControlValue(this.productForm, 'description'),
      //prodseller details
      price: this.getCurrPrice(),
      discount: this.getDiscAmount(),
      discount_rate: this.getDiscRate(),
      original_price: this.getFormControlValue(this.productSellerForm, 'price'),
      product_url: this.getFormControlValue(this.productSellerForm, 'url'),
      in_stock: this.getFormControlValue(this.productSellerForm, 'stock'),
      img_array: this.getFormControlValue(this.productSellerForm, 'imgs'),
    };
    //call the inventory facade and wait for it before navigating back to product page
    this.inventoryFacade.newProduct(data);
    this.router.navigate(['/inventory']);
    //clear the form
    // this.resetForm();
  }
  getDiscRate() {
    return this.getFormControlValue(this.productSellerForm, 'discount') / 100.0;
  }
  getDiscAmount() {
    return (
      this.getDiscRate() *
      this.getFormControlValue(this.productSellerForm, 'price')
    );
  }

  getCurrPrice() {
    return (
      this.getFormControlValue(this.productSellerForm, 'price') -
      this.getDiscAmount()
    );
  }
  // resetForm() {
  //   this.nameForm.reset();
  //   this.productForm.reset();
  //   this.productSellerForm.reset();
  //   this.newClicked = false;
  //   this.nextClicked = false;
  //   this.isSelected = false;
  // }

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
    // console.log(4);

    if (!this.file) {
      // console.log(5);
      this.errorMessage = 'Please select a file.';
      return;
    }
    const reader = new FileReader();
    // console.log(55);

    reader.onload = async (event: any) => {
      // console.log(77);

      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      let range = { s: { c: 1, r: 2 }, e: { c: 13, r: 301 } }; // 0-indexed

      // Convert the range of cells to JSON
      let jsonData = XLSX.utils.sheet_to_json(worksheet, {
        range: range,
        header: 1,
      });
      // Remove empty rows
      jsonData = jsonData.filter((row: any) =>
        row.some((cell: any) => cell !== null && cell !== '')
      );

      // console.log(jsonData);

      try {
        const res = await this.inventoryFacade.uploadBulkData(jsonData);
        console.log(res);
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Failed to send data.';
      }
    };
    reader.readAsArrayBuffer(this.file);
    // this.resultPage = true;
    this.close();
  }

  // async presentNewModal() {
  //   // await this.router.navigate(['new-product']);
  //   const modal = await this.modalController.create({
  //     mode: 'ios',
  //     cssClass: 'add-modal-second',
  //     component: PopovernewComponent,
  //   });
  //   modal.present();

  //   const { data, role } = await modal.onWillDismiss();

  //   if (role === 'confirm') {
  //     //do action after confirm
  //     // this.message = `Hello, ${data}!`;
  //   }
  // }
  close() {
    this.modalController.dismiss(null, 'close');
  }

  back() {
    if (!this.nextPage) {
      this.modalController.dismiss(null, 'back');
    } else {
      this.nextPage = false;
    }
  }
  selectProduct(prod: string) {
    console.log('selectProduct');
    this.nameForm.controls['newName'].setValue(prod.trim());
    this.closeDropDown();
    this.isExisting = this.isProductExists(prod);
    this.isSelected = true;
    // this.goToNextPage();
  }
  async createNew() {
    console.log('create new');
    this.closeDropDown();
    const name = this.getFormControlValue(this.nameForm, 'newName');
    this.isExisting = this.isProductExists(name);
    this.isSelected = true;
    // this.goToNextPage();
  }
  async nextClick() {
    // this.isSelected = false;
    if (this.nameForm.valid) {
      const newname = this.nameForm.value.newName;
      this.inputSubject$.next(newname);
      this.isDropdownOpen = true;
    }
  }
  async inputChanged(event: any) {
    this.isSelected = false;
    this.isExisting = false;
    if (!event.detail.value) {
      this.closeDropDown();
    } else {
      await this.nextClick();
    }
  }
  async closeDropDown() {
    console.log('closeDropDown');
    this.isDropdownOpen = false;
    this.isSearching = true;
  }
  goToNextPage() {
    if (this.type === 'single') {
      const name = this.getFormControlValue(this.nameForm, 'newName');
      if (name !== '') {
        this.setFormControlValue(this.productForm, 'name', name);
      }
    }
    this.nextPage = true;
  }
  isProductExists(name: string) {
    // Assuming 'newName' is the name of the new product
    // const name = this.getFormControlValue(this.nameForm, 'newName');
    // Check if 'newName' exists in 'similarProducts'
    if (this.similarProducts && this.similarProducts.length > 0) {
      return this.similarProducts.includes(name.trim());
    } else {
      return false;
    }
  }
  inputFocus() {
    this.isDropdownOpen = false;
  }
  create() {
    console.log('create');
    if (this.isFormValid()) {
      console.log('create form valid');
      if (this.isExisting) {
        this.createExistingProduct();
      } else {
        this.createNewProduct();
      }
      // this.resultPage = true;
      this.close();
    }
  }
  isFormValid() {
    console.log(1);
    this.markAsTouched(this.productSellerForm);
    if (this.isExisting) {
      console.log(2);

      return this.productSellerForm.valid;
    }
    this.markAsTouched(this.productForm);
    console.log(3);
    console.log(this.productSellerForm.valid);
    console.log(this.productForm.valid);
    console.log(this.productSellerForm.valid && this.productForm.valid);
    return this.productSellerForm.valid && this.productForm.valid;
  }
  markAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
