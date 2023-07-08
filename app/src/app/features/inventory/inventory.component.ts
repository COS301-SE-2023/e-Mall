import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProductService } from '@shared/servicies/product/product.service';
import { IProduct } from '@shared/models/product/product.interface';
import { tap } from 'rxjs/operators';
import { Observable, of, debounceTime, distinctUntilChanged, Subscription,} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {

  options = ['ALL', 'In Stock', 'Out of Stock'];
  selectedOption= "";

  selectOption(option: string) {
    this.selectedOption = option;
    // Add your logic here for handling the selected option
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
  ) {}
  // add logic here
}