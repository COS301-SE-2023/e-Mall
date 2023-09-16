/* eslint-disable @typescript-eslint/no-explicit-any */
import { IInventoryItem } from '../models/inventory-item.interface';
import { ISearchOptions } from '../models/search-options.interface';

export class SetInventory {
  static readonly type = '[Inventory] Set Inventory';
  constructor(public products: IInventoryItem[], public totalCount: number) {}
}
export class AddItems {
  static readonly type = '[Inventory] Add Items';
  constructor(public products: IInventoryItem[]) {}
}
export class DeleteItem {
  static readonly type = '[Inventory] Delete Items';
  constructor(public id: number) {}
}
export class UpdateItem {
  static readonly type = '[Inventory] Update an Item';
  constructor(public product: IInventoryItem) {}
}
export class UpdateItems {
  static readonly type = '[Inventory] Update Items';
  constructor(public products: Partial<IInventoryItem>[]) {}
}
export class SetQuery {
  static readonly type = '[Inventory] Set Query';
  constructor(public query: ISearchOptions) {}
}

export class ResetQuery {
  static readonly type = '[Inventory] Reset Query';
}

export class UpdateQuery {
  static readonly type = '[Inventory] Update Query';
  constructor(public query: Partial<ISearchOptions>) {}
}
export class UpdateFilterOptions {
  static readonly type = '[Inventory] Update Filter Options';
  constructor(public filterOptions: any) {}
}
export class ResetInventoryState {
  static readonly type = '[Inventory] Reset Inventory State';
}

export class AddNewProduct {
  static readonly type = '[Inventory] Add Product';
  constructor(
    public data: {
      seller_name: string;
      name: string;
      brand: string;
      category: string;
      description: string;
      //prodseller details
      price: number;
      discount: number;
      discount_rate: number;
      original_price: number;
      product_url: string;
      in_stock: boolean;
      img_array: string[];
    }
  ) {}
}

export class AddExistingProduct {
  static readonly type = '[Inventory] Add Existing Product';
  constructor(
    public data: {
      seller_name: string;
      product_name: string;
      price: number;
      discount: number;
      discount_rate: number;
      original_price: number;
      product_url: string;
      in_stock: boolean;
      img_array: string[];
    }
  ) {}
}
