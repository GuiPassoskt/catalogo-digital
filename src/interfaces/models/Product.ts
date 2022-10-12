export interface Product {
  id: string;
  name: string;
  description: string;
  amount: number;
  price: number;
  category_id: string;
  img_url: string | void;
}
