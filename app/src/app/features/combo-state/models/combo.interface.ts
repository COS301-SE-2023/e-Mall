import { IProduct } from "@shared/models/product/product.interface";

export interface ICombo {
    id: number;
    name: string;
    products: IProduct[];
    usernames: string[];
    pending_users: string[];
}

export type IComboResponse = Array<ICombo>