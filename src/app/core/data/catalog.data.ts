import { Category, Occasion, Product } from '../models/product.model';

export const CATEGORY_DATA: Category[] = [
  { name: 'Chocolate Drip Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=85' },
  { name: 'Berry Cakes',          image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=500&q=85' },
  { name: 'Birthday Cakes',       image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=500&q=85' },
  { name: 'Anniversary Cakes',    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=500&q=85' },
  { name: 'Custom Cakes',         image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=500&q=85' },
  { name: 'Bento Cakes',          image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=500&q=85' },
  { name: 'Cupcakes',             image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=500&q=85' },
];

export const PRODUCTS: Product[] = [
  { id: 1,  name: 'Royal Chocolate Berry Drip', category: 'Chocolate Drip Cakes', price: 1299, oldPrice: 1499, rating: 4.9, reviews: 186, badge: 'Bestseller',   veg: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=88', description: 'Rich chocolate layers finished with glossy drip ganache and fresh berries.' },
  { id: 2,  name: 'Belgian Choco Strawberry',   category: 'Birthday Cakes',       price: 1499, oldPrice: 1699, rating: 4.8, reviews: 312, badge: 'Loved',        veg: true, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=88', description: 'Soft cocoa sponge, smooth chocolate cream and ripe strawberry topping.' },
  { id: 3,  name: 'Strawberry Cream Celebration',category: 'Berry Cakes',          price: 1599, oldPrice: 1799, rating: 4.9, reviews: 97,  badge: 'Premium',      veg: true, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=88', description: 'A celebration cake finished with strawberry cream and seasonal berries.' },
  { id: 4,  name: 'Berry Heart Anniversary',    category: 'Anniversary Cakes',    price: 1399, oldPrice: 1599, rating: 4.7, reviews: 145, badge: 'Made to order',veg: true, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=88', description: 'Chocolate and berry flavours in a romantic, handcrafted celebration cake.' },
  { id: 5,  name: 'Chocolate Berry Cupcakes',   category: 'Cupcakes',             price: 699,  oldPrice: 799,  rating: 4.8, reviews: 201, badge: 'Box of 6',     veg: true, image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=900&q=88', description: 'Chocolate cupcakes topped with smooth frosting and berry accents.' },
  { id: 6,  name: 'Choco Berry Bento Cake',     category: 'Bento Cakes',          price: 599,  oldPrice: 699,  rating: 4.6, reviews: 88,  badge: 'Mini cake',    veg: true, image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=88', description: 'A little chocolate cake with creamy filling, berry details and a personal message.' },
  { id: 7,  name: 'Classic Chocolate Drip',     category: 'Chocolate Drip Cakes', price: 1199, oldPrice: 1399, rating: 4.9, reviews: 274, badge: 'Bestseller',   veg: true, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=900&q=88', description: 'Moist chocolate sponge with a rich ganache drip and chocolate curls.' },
  { id: 8,  name: 'Pink Berry Dream Cake',      category: 'Berry Cakes',          price: 1399, oldPrice: 1599, rating: 4.8, reviews: 116, badge: 'Freshly made', veg: true, image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=88', description: 'A soft vanilla cake with strawberry-pink cream and fresh berry topping.' },
  { id: 9,  name: 'Royal Birthday Drip Cake',   category: 'Birthday Cakes',       price: 1699, oldPrice: 1899, rating: 4.7, reviews: 79,  badge: 'Celebration',  veg: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=88', description: 'A showstopping chocolate drip cake topped with berries for birthdays.' },
  { id: 10, name: 'Design Your Royal Cake',     category: 'Custom Cakes',         price: 1799, oldPrice: 1999, rating: 4.9, reviews: 128, badge: 'Customisable', veg: true, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=88', description: 'Personalise your chocolate or berry cake with a colour palette, message and design.' },
  { id: 11, name: 'Strawberry Cloud Cake',      category: 'Birthday Cakes',       price: 1099, oldPrice: 1249, rating: 4.8, reviews: 165, badge: '100% eggless', veg: true, image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=88', description: 'Light vanilla sponge with strawberries and cloud-soft cream.' },
  { id: 12, name: 'Mini Cocoa Celebration',     category: 'Bento Cakes',          price: 549,  oldPrice: 649,  rating: 4.7, reviews: 104, badge: 'Trending',     veg: true, image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=88', description: 'A petite chocolate bento cake finished with cream and berry accents.' },
];

export const OCCASIONS: Occasion[] = [
  { title: 'Birthday Cakes',    note: 'Chocolate drips and berry toppings', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Anniversary Cakes', note: 'A sweet centrepiece for two',        image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Custom Cakes',      note: 'Made fresh for your celebration',    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85' },
];
