import { Url } from 'url';

export interface ISeller {
  business_name: string;
  is_verified: boolean;
  website: string;
  support_email: string;
  landline_number: string;
  address: string;
  city: string;
  postal_code: string;
  logo: Url;
  instagram_link: Url;
  facebook_link: Url;
  twitter_link: Url;
}
