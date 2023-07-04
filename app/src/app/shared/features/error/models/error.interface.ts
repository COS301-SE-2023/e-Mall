export class IError extends Error {
  constructor(public code: number, message: string) {
    super(message);
  }
}
