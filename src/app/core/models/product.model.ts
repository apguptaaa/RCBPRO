export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  veg: boolean;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  name: string;
  image: string;
}

export interface Occasion {
  title: string;
  note: string;
  image: string;
}
