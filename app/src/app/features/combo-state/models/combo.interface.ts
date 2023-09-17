import { IProduct } from '@shared/models/product/product.interface';

export interface ICombo {
  id: number;
  name: string;
  products: IProduct[];
  active_usernames: string[];
  active_emails: string[];
  pending_users: string[];
}

export interface ICombo_invites {
  id: number;
  name: string;
}
