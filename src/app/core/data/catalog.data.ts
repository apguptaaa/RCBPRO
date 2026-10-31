import { Category, Occasion, Product } from '../models/product.model';

export const CATEGORY_DATA: Category[] = [
  { name: 'Bento Cakes',     image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=85' },
  { name: 'Birthday Cakes',  image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=500&q=85' },
  { name: 'Fondant Cakes',   image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=500&q=85' },
  { name: 'Anniversary',     image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=500&q=85' },
  { name: 'Custom Cakes',    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=500&q=85' },
  { name: 'Cupcakes',        image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=500&q=85' },
  { name: 'Jar Cakes',       image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=85' },
  { name: 'Brownies',        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=85' },
  { name: 'Chocolates',      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=500&q=85' },
  { name: 'Flower Bouquets', image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=500&q=85' },
];

export const PRODUCTS: Product[] = [
  { id: 1,  name: 'Vintage Cherry Bento',           category: 'Bento Cakes',     price: 599,  oldPrice: 699,  rating: 4.9, reviews: 186, badge: 'Bestseller',    veg: true,  image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=900&q=88', description: 'Petite vanilla sponge layered with whipped cream and cherry compote.' },
  { id: 2,  name: 'Belgian Truffle Celebration',    category: 'Birthday Cakes',  price: 949,  oldPrice: 1099, rating: 4.8, reviews: 312, badge: '15% off',       veg: true,  image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=88', description: 'Rich cocoa sponge with silky Belgian chocolate ganache.' },
  { id: 3,  name: 'Ivory Garden Fondant Cake',      category: 'Fondant Cakes',   price: 2199, oldPrice: 2499, rating: 4.9, reviews: 97,  badge: 'Premium',       veg: true,  image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=88', description: 'Elegant fondant finish with delicate floral detailing.' },
  { id: 4,  name: 'Rose & Raspberry Romance',       category: 'Anniversary',     price: 1299, oldPrice: 1499, rating: 4.7, reviews: 145, badge: 'Loved',         veg: true,  image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=88', description: 'Raspberry preserve, vanilla sponge and soft rose buttercream.' },
  { id: 5,  name: 'Classic Buttercream Cupcakes',   category: 'Cupcakes',        price: 699,  oldPrice: 799,  rating: 4.8, reviews: 201, badge: 'Box of 6',      veg: true,  image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=900&q=88', description: 'Six handcrafted cupcakes with smooth vanilla buttercream.' },
  { id: 6,  name: 'Chocolate Hazelnut Jar Duo',     category: 'Jar Cakes',       price: 449,  oldPrice: 499,  rating: 4.6, reviews: 88,  badge: 'New',           veg: true,  image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=88', description: 'Layered chocolate cake jars with toasted hazelnut cream.' },
  { id: 7,  name: 'Fudgy Walnut Brownie Box',       category: 'Brownies',        price: 649,  oldPrice: 749,  rating: 4.9, reviews: 274, badge: 'Bestseller',    veg: true,  image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=88', description: 'Dense cocoa brownies with roasted walnuts and dark chocolate.' },
  { id: 8,  name: 'Artisan Chocolate Collection',   category: 'Chocolates',      price: 899,  oldPrice: 999,  rating: 4.8, reviews: 116, badge: 'Handmade',      veg: true,  image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=88', description: 'A refined assortment of handcrafted filled chocolates.' },
  { id: 9,  name: 'Blush Rose Celebration Bouquet', category: 'Flower Bouquets', price: 1199, oldPrice: 1399, rating: 4.7, reviews: 79,  badge: 'Fresh today',   veg: false, image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=88', description: 'Fresh blush roses wrapped in premium textured paper.' },
  { id: 10, name: 'Pastel Dream Custom Cake',       category: 'Custom Cakes',    price: 1799, oldPrice: 1999, rating: 4.9, reviews: 128, badge: 'Customisable',  veg: true,  image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=88', description: 'Personalise the flavour, palette, message and decorative details.' },
  { id: 11, name: 'Strawberry Cloud Birthday Cake', category: 'Birthday Cakes',  price: 1099, oldPrice: 1249, rating: 4.8, reviews: 165, badge: 'Eggless',        veg: true,  image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=88', description: 'Light vanilla sponge with strawberries and cloud-soft cream.' },
  { id: 12, name: 'Minimal Cocoa Bento',            category: 'Bento Cakes',     price: 549,  oldPrice: 649,  rating: 4.7, reviews: 104, badge: 'Trending',      veg: true,  image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=88', description: 'Minimalist chocolate bento cake made for intimate celebrations.' },
];

export const OCCASIONS: Occasion[] = [
  { title: 'Birthday Cheers',  note: 'Make their day unforgettable',   image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Anniversary Love', note: 'Thoughtful treats for two',      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Just Because',     note: 'Sweet surprises need no reason', image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=85' },
];
