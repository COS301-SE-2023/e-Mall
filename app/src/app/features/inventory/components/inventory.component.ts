/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription, debounceTime } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  ActionSheetController,
  AnimationController,
  IonContent,
  LoadingController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { PopovereditComponent } from './popoveredit/popoveredit.component';
import { IInventoryItem } from '../models/inventory-item.interface';
import { ISearchOptions } from '../models/search-options.interface';
import { InventoryFacade } from '../servicies/inventory.facade';
import { Router } from '@angular/router';
import { PopovernewComponent } from './popovernew/popovernew.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(IonContent)
  content!: IonContent;
  @ViewChild('inventory_header')
  inventory_header!: ElementRef;

  filterOptions = [
    { key: 'all', value: 'All' },
    { key: 'in', value: 'In Stock' },
    { key: 'out', value: 'Out of Stock' },
  ];
  searchOptions = [
    { key: 'name', value: 'Name' },
    // { key: 'id', value: 'ID' },
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
  // isLoading$: Observable<ActionsExecuting>;
  loading: HTMLIonLoadingElement | null | undefined;
  searchResultSubs = new Subscription();

  presentingElement = undefined;
  // isModalOpen = true;
  private canDismissOverride = false;
  firstModeal: any;
  constructor(
    private router: Router,
    private inventoryFacade: InventoryFacade,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    public modalController: ModalController, // public loaderFacade: PageLoaderFacade
    private actionSheetCtrl: ActionSheetController,
    private animationCtrl: AnimationController
  ) {
    // this.loaderFacade.loading.next(true);

    const options: ISearchOptions = {
      filterOptions: { filter_in_stock: 'all' },
    };
    // this.loaderFacade.loading.next(true);

    this.query$ = this.inventoryFacade.query$;

    this.inventoryFacade.updateFilter(options.filterOptions);
    this.searchResults$ = this.inventoryFacade.products$;
    this.searchResultSubs = this.searchResults$
      .pipe(debounceTime(500))
      .subscribe(results => this.scrollToTop());
    this.totalSearchCount$ = this.inventoryFacade.totalCount$;
  }
  ngOnDestroy(): void {
    this.searchResultSubs.unsubscribe();
  }

  onSearchInputChange(event: any) {
    if (event) {
      this.inventoryFacade.updateQuery({
        search: event.detail.value,
        searchOption: this.selectedSearchOption,
      });
    }
  }
  onFilterOptionChange(event: any) {
    if (event) {
      this.filter_changed = true;
      if (this.paginator) this.paginator.firstPage();
      const currentPage = 0;
      this.inventoryFacade.updateQuery({
        page: currentPage,
        per_page: this.prev_per_page,
        filterOptions: { filter_in_stock: event.detail.value },
      });
      this.filter_changed = false;
    }
  }
  ionViewWillEnter() {
    if (this.paginator) this.paginator.firstPage();
  }
  onSortOptionChange(): void {
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
        if (this.paginator) this.paginator.firstPage();
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
    if (this.content) this.content.scrollToPoint(0, 0, 500);
    // this.inventory_header.nativeElement.scrollIntoView({ behavior: 'smooth' });
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

  async presentNewModal(modalType: string) {
    // this.isModalOpen = false;

    // await this.router.navigate(['new-product']);
    this.firstModeal = await this.modalController.getTop();
    await this.firstModeal.dismiss();
    // console.log(modalType, 'dddd');
    const modal = await this.modalController.create({
      mode: 'ios',
      cssClass: 'add-modal-second',
      component: PopovernewComponent,
      componentProps: {
        type: modalType, // Pass "single" as a parameter
      },
      // animated: false,
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    });
    modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'back') {
      await this.firstModeal.present();
    }
  }
  // modal() {
  //   this.isModalOpen = true;
  // }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot!;
    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(200)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl)?.direction('reverse');
  };
}
