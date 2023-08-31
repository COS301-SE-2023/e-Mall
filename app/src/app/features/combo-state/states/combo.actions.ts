import { ICombo } from "../models/combo.interface";

export class SetCombos {
    static readonly type = '[Combo] Set Combos';
    constructor(public combos: ICombo[]) {}
}

export class UpdateCombo {
    static readonly type = '[Combo] Update Combo';
    constructor(
    public payload: { combo: Partial< ICombo > }) {}
}

export class UpdateUsers {
    static readonly type = '[Combo] Update Users';
    constructor(public payload: {
        combo: any; 
}) {}
}

export class DeleteUser {
  static readonly type = '[Combo] Delete Combo';
  constructor(public comboId: number, public username: string) {}
}

export class ClearCombos {
    static readonly type = '[Combo] Clear Combos';
}


