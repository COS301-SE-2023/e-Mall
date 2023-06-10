import { Injectable } from '@angular/core';
import { State } from '@app/models/state.interface';
@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _state: State;
  constructor() {
    this._state = {};
  }
  getState(field?: string) {
    if (field == undefined) {
      return this._state;
    }

    const fields = Object.keys(this._state);
    if (fields.includes(field)) {
      return this._state[field];
    } else {
      return null;
    }
  }
  setState(field?: string, data?: unknown) {
    if (field == undefined) {
      this._state = {};
    } else {
      this._state[field] = data;
    }
  }
}
