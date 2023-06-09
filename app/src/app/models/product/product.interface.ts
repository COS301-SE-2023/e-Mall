export interface IProduct {
  id: number;
  min_price_img_array?: string[];
  name: string;
  description?: string;
  brand: string;
  category: string;
  min_price: number;
  min_price_seller_id?: string;
  min_price_seller_product_url?: string;
  min_price_seller_business_name?: string;
  min_price_in_stock?: boolean;
  min_price_discount?: number;
  min_price_discount_rate?: number;
  min_price_original_price?: number;
  created_at?: string;
  updated_at?: string;
}
