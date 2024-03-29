/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, debounceTime, pairwise } from 'rxjs';
import { InventoryService } from './inventory.service';
import { InventorySelectors } from '../states/inventory.selector';
import { IInventoryItem } from '../models/inventory-item.interface';
import { ISearchOptions } from '../models/search-options.interface';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as InventoryActions from '../states/inventory.action';
import { SetError } from '@features/error/states/error.action';
import { IError } from '@features/error/models/error.interface';
import { ErrorFacade } from '@app/features/error/services/error.facade';
import { ToastComponent } from '@app/shared/components/toast/toast.component';
// import { LoaderFacade } from '@app/shared/components/loader/loader-for-state.facade';
//import { LoaderFacade } from '@shared/components/loader/loader.facade';
// import { PageLoaderFacade } from '@app/shared/components/loader/loader-for-page.facade';

@Injectable()
export class InventoryFacade implements OnDestroy {
  @Select(InventorySelectors.products)
  products$!: Observable<IInventoryItem[]>;
  @Select(InventorySelectors.query)
  query$!: Observable<ISearchOptions>;
  @Select(InventorySelectors.totalCount)
  totalCount$!: Observable<number>;
  @Select(InventorySelectors.filter)
  filters$!: Observable<any>;
  @Select(InventorySelectors.newProducts)
  newProducts$!: Observable<any>;

  querySubs: Subscription;
  productSubs: Subscription;
  queryTemp: ISearchOptions;

  actions = [
    InventoryActions.UpdateFilterOptions,
    InventoryActions.UpdateQuery,
    InventoryActions.SetInventory,
    InventoryActions.DeleteItem,
    InventoryActions.UpdateItems,
  ];
  constructor(
    private inventoryService: InventoryService,
    private errorFacade: ErrorFacade,
    private toast: ToastComponent,
    private store: Store
  ) {
    this.queryTemp = {};
    this.resetState();
    this.querySubs = this.query$
      .pipe(debounceTime(500))
      .subscribe(async query => {
        if (query) {
          this.fetchItems(query);
          this.queryTemp = query;
        }
      });
    this.productSubs = this.products$
      .pipe(pairwise(), debounceTime(500))
      .subscribe(async ([prevProducts, currProducts]) => {
        if (prevProducts && currProducts) {
          if (prevProducts.length - 1 === currProducts.length) {
            await this.fetchItems(this.queryTemp);
          }
        }
      });
  }

  ngOnDestroy(): void {
    //this.loaderFacade.removeActions(this.actions);
    console.log('inventory facade destroyed');
  }
  async fetchItems(options: ISearchOptions) {
    try {
      const res = await this.inventoryService.getProductSellerData(options);
      return this.setInventory(res.products, res.totalCount);
    } catch (error) {
      return this.setError(error);
    }
  }
  async updateItem(data: IInventoryItem) {
    try {
      return [
        this.updateStateItems([data]),
        await this.inventoryService.updateProductSellerData(data),
      ];
    } catch (error) {
      return this.setError(error);
    }
  }
  async removeItem(data: IInventoryItem) {
    try {
      await this.inventoryService.deleteProductSellerData(data);
      return this.removeStateItem(data);
    } catch (error) {
      return this.setError(error);
    }
  }
  async downloadFile() {
    return await this.inventoryService.downloadFile();
  }
  // @Dispatch()
  async uploadBulkData(data: any) {
    try {
      const res = await this.inventoryService.uploadBulkData(data);
      if (res['success'] !== 0 && res['new_product_sellers']) {
        await this.fetchItems(this.queryTemp);
        // this.store.dispatch(
        //   new InventoryActions.AddNewProducts(res['new_product_sellers'])
        // );
      }
      if (res['failed'] !== 0)
        throw `Failed to upload ${res['failed']}/${res['total']} products`;
      return this.toastSuccess(
        `Successfully uploaded ${res['successful']} products`
      );
      // return new InventoryActions.AddNewProducts(res['new_product_sellers']);
    } catch (error) {
      return this.setError(error);
    }
  }

  async getSimilarProducts(prodName: string) {
    try {
      return await this.inventoryService.getSimilarProducts(prodName);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  updateStateItems(products: IInventoryItem[]) {
    return new InventoryActions.UpdateItems(products);
  }
  @Dispatch()
  removeStateItem(data: IInventoryItem) {
    return new InventoryActions.DeleteItem(data.id);
  }

  @Dispatch()
  setInventory(items: IInventoryItem[], total: number) {
    return new InventoryActions.SetInventory(items, total);
  }
  @Dispatch()
  setQuery(options: ISearchOptions) {
    return new InventoryActions.SetQuery(options);
  }
  @Dispatch()
  updateQuery(filter: any) {
    return new InventoryActions.UpdateQuery(filter);
  }
  @Dispatch()
  updateFilter(filter: any) {
    return new InventoryActions.UpdateFilterOptions(filter);
  }
  @Dispatch()
  setError(error: any) {
    if (typeof error === 'string' && !error.includes('token')) {
      this.toast.presentErrorToastWithMessage(error);
    }
    return new SetError('inventory', error as IError);
  }
  @Dispatch()
  resetState() {
    return new InventoryActions.ResetInventoryState();
  }

  async newProduct(data: any) {
    try {
      //service will return a product seller instance with product id
      await this.inventoryService.addnewProduct(data);
      this.toastSuccess('Successfully added a new product');
      return await this.fetchItems(this.queryTemp);
      // return new InventoryActions.AddNewProduct(res.body.data);
    } catch (error) {
      return this.setError(error);
    }
  }

  async addExistingProduct(data: any) {
    try {
      await this.inventoryService.addSimilarProduct(data);
      this.toastSuccess('Successfully added a new product');
      // return new InventoryActions.AddExistingProduct(res.body.data);
      return await this.fetchItems(this.queryTemp);
    } catch (error) {
      return this.setError(error);
    }
  }
  toastSuccess(message: string) {
    this.toast.presentSuccessToast(message);
  }
}
