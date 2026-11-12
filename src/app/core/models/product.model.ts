export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  veg: boolean;
  image: string;
  description: string;
  flavours?: string[];
  unit_type?: 'weight' | 'count';
}

export interface CartItem extends Product {
  quantity: number;
  variant?: string;
  message?: string;
}

export interface Category {
  name: string;
  image: string;
  parentName?: string;
}

export interface Occasion {
  title: string;
  note: string;
  image: string;
}
