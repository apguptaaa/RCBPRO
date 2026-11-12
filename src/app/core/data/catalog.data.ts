import { Category, Occasion, Product } from '../models/product.model';

export const CATEGORY_DATA: Category[] = [
  { name: 'Simple Cakes',   image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=500&q=85' },
  { name: 'Theme Cakes',    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=500&q=85' },
  { name: 'Designer Cakes', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=500&q=85' },
  { name: 'Cartoon Cakes',  image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=85' },
  { name: 'Pinata Cake',    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=500&q=85' },
];

export const DEFAULT_FLAVOURS = ['Belgian chocolate', 'Vanilla berry', 'Red velvet', 'Butterscotch', 'Fresh fruit'];

const staticProduct = (
  id: number,
  name: string,
  category: string,
  price: number,
  image: string,
  description: string,
  unit_type: 'weight' | 'count' = 'weight'
): Product => ({
  id,
  name,
  category,
  price,
  oldPrice: price,
  rating: 0,
  reviews: 0,
  badge: 'Sample',
  veg: true,
  image,
  description,
  flavours: [...DEFAULT_FLAVOURS],
  unit_type
});

export const PRODUCTS: Product[] = [
  staticProduct(-1, 'Classic Vanilla Cake', 'Simple Cakes', 799, CATEGORY_DATA[0].image, 'A light, simple celebration cake with smooth vanilla cream.'),
  staticProduct(-2, 'Chocolate Truffle Cake', 'Simple Cakes', 999, CATEGORY_DATA[2].image, 'A rich chocolate cake finished with silky truffle frosting.'),
  staticProduct(-3, 'Fresh Fruit Cream Cake', 'Simple Cakes', 1099, CATEGORY_DATA[0].image, 'A soft cream cake topped with seasonal fruit.'),
  staticProduct(-4, 'Butterscotch Crunch Cake', 'Simple Cakes', 899, CATEGORY_DATA[2].image, 'A classic butterscotch cake with a gentle caramel crunch.'),
  staticProduct(-5, 'Chocolate Berry Cupcakes', 'Simple Cakes', 699, CATEGORY_DATA[0].image, 'A sample box of six chocolate cupcakes with berry frosting.', 'count'),
  staticProduct(-6, 'Dinosaur Adventure Cake', 'Theme Cakes', 1799, CATEGORY_DATA[1].image, 'A playful dinosaur-themed cake for a special celebration.'),
  staticProduct(-7, 'Princess Castle Cake', 'Theme Cakes', 1999, CATEGORY_DATA[1].image, 'A colorful castle-inspired cake for a storybook celebration.'),
  staticProduct(-8, 'Space Explorer Cake', 'Theme Cakes', 1899, CATEGORY_DATA[1].image, 'A space-themed cake decorated with stars and planets.'),
  staticProduct(-9, 'Jungle Safari Cake', 'Theme Cakes', 1799, CATEGORY_DATA[1].image, 'A safari-themed cake with a bright jungle-inspired finish.'),
  staticProduct(-10, 'Rainbow Celebration Cake', 'Theme Cakes', 1699, CATEGORY_DATA[1].image, 'A cheerful rainbow cake for birthdays and celebrations.'),
  staticProduct(-11, 'Belgian Chocolate Drip Cake', 'Designer Cakes', 1499, CATEGORY_DATA[2].image, 'A handcrafted chocolate cake with a polished drip finish.'),
  staticProduct(-12, 'Red Velvet Rose Cake', 'Designer Cakes', 1599, CATEGORY_DATA[2].image, 'A red velvet cake finished with elegant cream details.'),
  staticProduct(-13, 'Elegant Floral Cake', 'Designer Cakes', 1699, CATEGORY_DATA[2].image, 'A refined cake with a delicate floral-inspired design.'),
  staticProduct(-14, 'Golden Celebration Cake', 'Designer Cakes', 1899, CATEGORY_DATA[2].image, 'A celebration cake with a stylish golden finish.'),
  staticProduct(-15, 'Strawberry Designer Cake', 'Designer Cakes', 1599, CATEGORY_DATA[2].image, 'A strawberry cream cake with a handcrafted finish.'),
  staticProduct(-16, 'Cute Animal Cartoon Cake', 'Cartoon Cakes', 1799, CATEGORY_DATA[3].image, 'A cute cartoon-inspired cake for a joyful celebration.'),
  staticProduct(-17, 'Blue Cartoon Birthday Cake', 'Cartoon Cakes', 1699, CATEGORY_DATA[3].image, 'A bright blue cartoon-style cake for a birthday.'),
  staticProduct(-18, 'Pink Character Cake', 'Cartoon Cakes', 1799, CATEGORY_DATA[3].image, 'A colorful character-themed cake with a playful design.'),
  staticProduct(-19, 'Superhero Celebration Cake', 'Cartoon Cakes', 1899, CATEGORY_DATA[3].image, 'A superhero-inspired cake for a little fan.'),
  staticProduct(-20, 'Smiling Character Cake', 'Cartoon Cakes', 1699, CATEGORY_DATA[3].image, 'A cheerful cartoon cake with a fun celebration look.'),
  staticProduct(-21, 'Chocolate Pinata Cake', 'Pinata Cake', 1599, CATEGORY_DATA[4].image, 'A chocolate pinata-style cake made for a fun surprise.'),
  staticProduct(-22, 'Heart Pinata Cake', 'Pinata Cake', 1699, CATEGORY_DATA[4].image, 'A heart-shaped pinata cake for a special occasion.'),
  staticProduct(-23, 'Surprise Candy Pinata Cake', 'Pinata Cake', 1799, CATEGORY_DATA[4].image, 'A pinata cake designed for a sweet surprise inside.'),
  staticProduct(-24, 'Red Velvet Pinata Cake', 'Pinata Cake', 1699, CATEGORY_DATA[4].image, 'A red velvet pinata cake with a rich, festive finish.'),
  staticProduct(-25, 'Celebration Pinata Cake', 'Pinata Cake', 1899, CATEGORY_DATA[4].image, 'A colorful pinata cake for birthdays and celebrations.')
];

export const OCCASIONS: Occasion[] = [
  { title: 'Birthday Cakes',    note: 'Chocolate drips and berry toppings', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Anniversary Cakes', note: 'A sweet centrepiece for two',        image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Custom Cakes',      note: 'Made fresh for your celebration',    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85' },
];
