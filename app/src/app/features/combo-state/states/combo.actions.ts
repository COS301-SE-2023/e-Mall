import { ICombo,IComboResponse } from "../models/combo.interface";

export class SetCombos {
    static readonly type = '[Combo] Set Combos';
    constructor(public combos: IComboResponse) {}
}

export class UpdateCombo {
    static readonly type = '[Combo] Update Combo';
    constructor(public payload: { combo: Partial<ICombo> }) {}
}

export class UpdateUsers {
    static readonly type = '[Combo] Update Users';
    constructor(public payload: { combo: Partial<ICombo> }) {}
}

export class DeleteCombo {
    static readonly type = '[Combo] Delete Combo';
    constructor(public id: number) {}
}

