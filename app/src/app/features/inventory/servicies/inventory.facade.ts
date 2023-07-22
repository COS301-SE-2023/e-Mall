/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { InventoryService } from './inventory.service';
import { InventorySelectors } from '../states/inventory.selector';
import { IInventoryItem } from '../models/inventory-item.interface';
import { ISearchOptions } from '../models/search-options.interface';
import { InventoryState } from '../states/inventory.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as InventoryActions from '../states/inventory.action';
import { SetError } from '@features/error/states/error.action';
import { IError } from '@features/error/models/error.interface';
import {
  ActionsExecuting,
  actionsExecuting,
} from '@ngxs-labs/actions-executing';

@Injectable()
export class InventoryFacade {
  @Select(InventorySelectors.products)
  products$!: Observable<IInventoryItem[]>;
  @Select(InventorySelectors.query)
  query$!: Observable<ISearchOptions>;
  @Select(InventorySelectors.totalCount)
  totalCount$!: Observable<number>;
  @Select(InventorySelectors.filter)
  filters$!: Observable<any>;

  querySubs: Subscription;
  @Select(
    actionsExecuting([
      InventoryActions.UpdateFilterOptions,
      InventoryActions.UpdateQuery,
      InventoryActions.SetInventory,
    ])
  )
  loading$!: Observable<ActionsExecuting>;
  constructor(
    private inventoryService: InventoryService,
    private inventoryState: InventoryState,
    private actions$: Actions
  ) {
    console.log('inventory facade initialized');
    this.resetState();
    this.querySubs = this.query$.subscribe(async query => {
      if (query) this.fetchItems(query);
    });
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
}
