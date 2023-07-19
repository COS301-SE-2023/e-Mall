import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InventoryService } from './inventory.service';
import { InventorySelectors } from '../states/inventory.selector';
import { IInventoryItem } from '../models/inventory-item.interface';
import { ISearchOptions } from '../models/search-options.interface';

@Injectable()
export class InventoryFacade {
  @Select(InventorySelectors.products)
  products$!: Observable<IInventoryItem[]>;
  @Select(InventorySelectors.filters)
  filters$!: Observable<ISearchOptions>;
  constructor(private inventoryService: InventoryService) {}

  async getInventoryItems(options: ISearchOptions): Promise<any> {
    return await this.inventoryService.getProductSellerData(options);
  }
}
