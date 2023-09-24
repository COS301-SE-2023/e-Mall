/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription, debounceTime, pairwise } from 'rxjs';
import { InventoryService } from './inventory.service';
import { InventorySelectors } from '../states/inventory.selector';
import { IInventoryItem } from '../models/inventory-item.interface';
import { ISearchOptions } from '../models/search-options.interface';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as InventoryActions from '../states/inventory.action';
import { SetError } from '@features/error/states/error.action';
import { IError } from '@features/error/models/error.interface';
import { IProduct } from '@app/shared/models/product/product.interface';
import { IProductSeller } from '@app/shared/models/product/product-seller.interface';
import { LoaderFacade } from '@app/shared/components/loader/loader-for-state.facade';
//import { LoaderFacade } from '@shared/components/loader/loader.facade';

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
    private loaderFacade: LoaderFacade
  ) {
    this.loaderFacade.addActions(this.actions);

    this.queryTemp = {};
    console.log('inventory facade initialized');
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
      console.log('fetching items');
      const res = await this.inventoryService.getProductSellerData(options);
      return this.setInventory(res.products, res.totalCount);
    } catch (error) {
      return this.setError(error);
    }
  }
  async updateItem(data: IInventoryItem) {
    try {
      console.log('updating item');

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
      console.log('updating item');
      await this.inventoryService.deleteProductSellerData(data);
      return this.removeStateItem(data);
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
    return new SetError('inventory', error as IError);
  }
  @Dispatch()
  resetState() {
    return new InventoryActions.ResetInventoryState();
  }

  @Dispatch()
  async newProduct(data: any) {
    try {
      //service will return a product seller instance with product id
      const res = await this.inventoryService.addnewProduct(data);
      return new InventoryActions.AddNewProduct(res.data);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  async addExistingProduct(data: any) {
    try {
      const res = await this.inventoryService.addSimilarProduct(data);
      return new InventoryActions.AddExistingProduct(res.data);
    } catch (error) {
      return this.setError(error);
    }
  }
}
