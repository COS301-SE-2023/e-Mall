import { IProduct } from '@app/shared/models/product/product.interface';

export class SetWishlist {
  static readonly type = '[Wishlist] Set Wishlist';
  constructor(public products: IProduct[]) {}
}

export class AddProductToWishlist {
  static readonly type = '[Wishlist] Add Product To Wishlist';
  constructor(public product: IProduct) {}
}

export class RemoveProductFromWishlist {
  static readonly type = '[Wishlist] Remove Product From Wishlist';
  constructor(public product: IProduct) {}
}

export class ClearWishlist {
  static readonly type = '[Wishlist] Clear Wishlist';
}
