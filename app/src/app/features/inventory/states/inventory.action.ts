import { IInventoryItem } from '../models/inventory-item.interface';
import { ISearchOptions } from '../models/search-options.interface';

export class SetInventory {
  static readonly type = '[Inventory] Set Inventory';
  constructor(public products: IInventoryItem[]) {}
}
export class AddItems {
  static readonly type = '[Inventory] Add Items';
  constructor(public products: IInventoryItem[]) {}
}
export class DeleteItems {
  static readonly type = '[Inventory] Delete Items';
  constructor(public products: IInventoryItem[]) {}
}
export class UpdateItem {
  static readonly type = '[Inventory] Update an Item';
  constructor(public product: IInventoryItem) {}
}
export class UpdateItems {
  static readonly type = '[Inventory] Update Items';
  constructor(public products: IInventoryItem[]) {}
}
export class SetFilter {
  static readonly type = '[Inventory] Set Filter';
  constructor(public filterOptions: ISearchOptions) {}
}

export class ResetFilter {
  static readonly type = '[Inventory] Reset Filter';
}

export class UpdateFilter {
  static readonly type = '[Inventory] Update Filter';
  constructor(public filterOptions: Partial<ISearchOptions>) {}
}
