import { IProduct } from '@shared/models/product/product.interface';
import { ICombo, ICombo_invites } from '../models/combo.interface';

export class SetCombos {
  static readonly type = '[Combo] Set Combos';
  constructor(
    public payload: {
      combos: ICombo[];
      combo_invites: ICombo_invites[];
    }
  ) {}
}

export class InviteUsers {
  static readonly type = '[Combo] Invited Users';
  constructor(
    public payload: {
      combo_id: number;
      user_emails: string[];
    }
  ) {}
}

export class RemoveProductFromCombo {
  static readonly type = '[Combo] Remove Product From Combo';
  constructor(
    public payload: {
      combo_id: number;
      product_id: number;
    }
  ) {}
}

export class EditCombo {
  static readonly type = '[Combo] Edit Combo';
  constructor(
    public payload: {
      combo_id: number;
      combo_name: string;
    }
  ) {}
}

export class UpdateUsers {
  static readonly type = '[Combo] Update Users';
  constructor(
    public payload: {
      combo_id: number;
      user_email: string;
      action: string;
    }
  ) {}
}

export class DeleteUser {
  static readonly type = '[Combo] Delete Combo';
  constructor(
    public payload: {
      combo_id: number;
    }
  ) {}
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
      current_user_email: string;
      combo_name: string;
      user_emails: string[];
      product_ids: number[];
      product: IProduct;
      username: string[];
    }
  ) {}
}
