/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISellerProfile {
  id: string;
  username?: string;
  email: string;
  type: string;
  details: {
    reg_no?: string;
    business_name?: string;
    business_type?: string;
    catalogue_size?: number;
    business_category?: string;
    status?: string;
    is_verified?: boolean;
    website?: string;
    feed_url?: string;
    created_at?: string;
    modified_at?: string;
    last_login?: string;
    wishlist?: any;
    followed_sellers?: any;
    twitter_link?: string;
    facebook_link?: string;
    instagram_link?: string;
    logo?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    landline_number?: number;
    support_email?: string;
    recommended_products?: any;
    first_name?: string;
    last_name?: string;
    phone_number?: number;
  };
}
