import { IError } from '../model/error.interface';

export class SetError {
  static readonly type = '[Error] Set Error';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public key: string, public error: IError) {}
}

export class ClearError {
  static readonly type = '[Error] Clear Error';
  constructor(public key: string) {}
}
