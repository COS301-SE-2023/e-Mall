/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IConsumerProfile {
  id: string;
  username?: string;
  email: string;
  type: string;
  details: { wishlist?: any; followed_sellers?: any; recommended_products?: any };
}
