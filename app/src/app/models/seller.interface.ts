export interface ISellerForm {
  id?: string;
  username?: string;
  email: string;
  password?: string;
  type: string;
  reg_no?: string;
  business_name?: string;
  business_type: string;
  catalogue_size: number;
  business_category?: string;
  no_employees: number;
  status?: string;
  is_verified?: boolean;
  website: string;
  feed_url: string;
  verification_code?: string;
}
export interface ISellerProfile {
  id: string;
  username: string;
  email: string;
  type: string;
  reg_no: string;
  business_name: string;
  business_type: string;
  catalogue_size: number;
  business_category: string;
  status: string;
  is_verified: boolean;
  website: string;
  feed_url: string;
  created_at: string;
  modified_at: string;
  last_login: string;
}
