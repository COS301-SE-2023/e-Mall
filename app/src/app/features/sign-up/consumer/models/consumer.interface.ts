export interface IConsumerProfile {
  username: string;
  email: string;
  password?: string;
  type: string;
  wishlist: string[];
}
export interface IConsumerForm {
  username?: string;
  email: string;
  password?: string;
  type: string;
  verification_code?: string;
}
