export interface IConsumerProfile {
  id: string;
  username?: string;
  email: string;
  type: string;
  details: { wishlist?: string[] };
}
