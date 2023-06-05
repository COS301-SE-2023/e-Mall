export interface IConsumerForm {
  username: string;
  email: string;
  password: string;
  type: string;
  verificatn_code?: string;
}
export interface IConsumerProfile {
  username: string;
  email: string;
  password?: string;
  type: string;
  wishlist: string[];
}
