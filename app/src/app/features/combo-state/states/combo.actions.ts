import { IProduct } from '@shared/models/product/product.interface';
import { ICombo } from '../models/combo.interface';

export class SetCombos {
  static readonly type = '[Combo] Set Combos';
  constructor(public combos: ICombo[]) {}
}

export class UpdateCombo {
  static readonly type = '[Combo] Update Combo';
  constructor(
    public payload: {
      combo_ids: number[];
      product_id: number;
      product: IProduct;
    }
  ) {}
}

export class UpdateUsers {
  static readonly type = '[Combo] Update Users';
  constructor(
    public payload: {
      combo: any;
    }
  ) {}
}

export class DeleteUser {
  static readonly type = '[Combo] Delete Combo';
  constructor(public comboId: number, public username: string) {}
}

export class ClearCombos {
  static readonly type = '[Combo] Clear Combos';
}

export class GetOneCombo {
  static readonly type = '[Combo] Get One Combo';
  constructor(public comboId: number) {}
}

export class CreateCombo {
  static readonly type = '[Combo] Create Combo';
  constructor(
    public payload: {
      combo_name: string;
      user_emails: string[];
      product_ids: number[];
      product: IProduct;
      username: string[];
    }
  ) {}
}
