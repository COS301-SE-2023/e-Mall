export interface IInventoryItem {
  id: number;
  original_price?: number;
  price?: number;
  discount?: number;
  discount_rate?: number;
  product_url?: string;
  in_stock?: boolean;
  img_array?: Array<string>;
  product?: string;
  seller?: string;
  product_name?: string;
  product_category?: string;
}
