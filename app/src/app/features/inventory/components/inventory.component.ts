/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core';
import { Observable, debounceTime, map, merge, of } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  IonContent,
  LoadingController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { PopovereditComponent } from './popoveredit/popoveredit.component';
import { IInventoryItem } from '../models/inventory-item.interface';
import { ISearchOptions } from '../models/search-options.interface';
import { InventoryFacade } from '../servicies/inventory.facade';
import { ActionsExecuting } from '@ngxs-labs/actions-executing';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(IonContent)
  content!: IonContent;
  filterOptions = [
    { key: 'all', value: 'All' },
    { key: 'in', value: 'In Stock' },
    { key: 'out', value: 'Out of Stock' },
  ];
  searchOptions = [
    { key: 'name', value: 'Name' },
    { key: 'id', value: 'ID' },
    { key: 'category', value: 'Category' },
  ];
  sortOptions = [
    { key: 'name', value: 'Name (A-Z)' },
    { key: '-name', value: 'Name (Z-A)' },
    { key: 'price', value: 'Lowest Price' },
    { key: '-price', value: 'Highest Price' },
    { key: 'discount', value: 'Lowest Disocunt' },
    { key: '-discount', value: 'Highest Disocunt' },
  ];
  selectedFilterOption = 'all';
  selectedSearchOption = 'name';
  selectedSortOption = 'name';
  serachKeyword = '';

  totalSearchCount$: Observable<number> | undefined;
  searchResults$: Observable<IInventoryItem[]> | undefined;
  query$: Observable<ISearchOptions>;
  prev_per_page = 10;
  filter_changed = false;
  isLoading$: Observable<ActionsExecuting>;
  loading: HTMLIonLoadingElement | null | undefined;
  loadingBool = of(false);
  constructor(
    private inventoryFacade: InventoryFacade,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    public modalController: ModalController
  ) {
    const options: ISearchOptions = {
      filterOptions: { filter_in_stock: 'all' },
    };
    this.isLoading$ = this.inventoryFacade.loading$;
    this.loading = null;
    merge(
      this.isLoading$.pipe(map(() => true)),
      this.isLoading$.pipe(
        debounceTime(2000),
        map(() => false)
      )
    ).subscribe(async shouldPresent => {
      if (shouldPresent) {
        this.presentLoading();
      } else {
        this.dismissLoading();
      }
    });

    this.query$ = this.inventoryFacade.query$;

    this.inventoryFacade.updateFilter(options.filterOptions);
    this.searchResults$ = this.inventoryFacade.products$;
    this.totalSearchCount$ = this.inventoryFacade.totalCount$;
  }
  async presentLoading() {
    if (this.loading === null) {
      this.loading = undefined;
      this.loading = await this.loadingController.create({
        spinner: 'dots',
        message: 'Please wait...',
        mode: 'ios',
      });
      await this.loading.present();
      console.log('presenting loading');
    }
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
      this.scrollToTop();
      console.log('dismissed loading');
    }
  }
  onSearchInputChange(event: any) {
    if (event) {
      console.log(
        'onSearchInputChange ',
        event.detail.value,
        this.selectedSearchOption
      );
      this.inventoryFacade.updateQuery({
        search: event.detail.value,
        searchOption: this.selectedSearchOption,
      });
    }
  }
  onFilterOptionChange(event: any) {
    if (event) {
      this.filter_changed = true;
      console.log('onFilterOptionChange ', event.detail.value);
      this.paginator.firstPage();
      const currentPage = 0;
      this.inventoryFacade.updateQuery({
        page: currentPage,
        per_page: this.prev_per_page,
        filterOptions: { filter_in_stock: event.detail.value },
      });
      this.filter_changed = false;
    }
  }

  onSortOptionChange(): void {
    console.log('onSortOptionChange', this.selectedSortOption);
    this.inventoryFacade.updateQuery({ sortOption: this.selectedSortOption });
  }

  onPageChange(event: PageEvent) {
    if (event && !this.filter_changed) {
      let currentPage = event.pageIndex;
      const itemsPerPage = event.pageSize;
      if (
        event.previousPageIndex !== event.pageIndex &&
        this.prev_per_page != itemsPerPage
      ) {
        this.paginator.firstPage();
        this.prev_per_page = itemsPerPage;
        currentPage = 0;
      }
      this.inventoryFacade.updateQuery({
        page: currentPage,
        per_page: itemsPerPage,
      });
    }
  }

  async selectProduct(product: any) {
    const popover = await this.popoverController.create({
      component: PopovereditComponent,
      componentProps: {
        product: product,
      },
      translucent: true,
    });

    return await popover.present();
  }
  searchPopoverOptions: any = {
    side: 'bottom',
    alignment: 'center',
    cssClass: 'search-popover',
    size: 'cover',
  };
  sortPopoverOptions: any = {
    side: 'bottom',
    alignment: 'center',
    cssClass: 'sort-popover',
    size: 'cover',
  };
  scrollToTop() {
    this.content.scrollToPoint(0, 0, 500);
  }
  async openModal(product: IInventoryItem) {
    const modal = await this.modalController.create({
      component: PopovereditComponent,
      componentProps: {
        product: product,
      },
      mode: 'ios',
      cssClass: ['inventory-modal'],
    });
    return await modal.present();
  }
  async presentPopover(event: Event, product: IInventoryItem) {
    const popover = await this.popoverController.create({
      component: PopovereditComponent,
      event: event,

      translucent: true,
      size: 'cover',
      alignment: 'center',
      componentProps: {
        product: product,
      },
    });
    return await popover.present();
  }
}
