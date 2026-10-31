import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem, Product } from '../models/product.model';
import { CATEGORY_DATA, PRODUCTS } from '../data/catalog.data';

@Injectable({ providedIn: 'root' })
export class StoreService {
  // ── Static catalog ───────────────────────────────────────────────────────
  readonly categoryData = CATEGORY_DATA;
  readonly products     = PRODUCTS;

  // ── Overlay state ────────────────────────────────────────────────────────
  readonly mobileOpen = signal(false);
  readonly cartOpen   = signal(false);
  readonly quickView  = signal<Product | null>(null);
  readonly customOpen = signal(false);

  // ── Shop state ───────────────────────────────────────────────────────────
  readonly activeCategory = signal<string>('All');
  readonly search         = signal<string>('');
  readonly sort           = signal<string>('popular');
  readonly location       = signal<string>('New Delhi');

  // ── Cart & wishlist ──────────────────────────────────────────────────────
  readonly cart     = signal<CartItem[]>([]);
  readonly wishlist = signal<number[]>([]);
  readonly toast    = signal<string>('');

  // ── Derived ──────────────────────────────────────────────────────────────
  readonly filteredProducts = computed(() => {
    const cat    = this.activeCategory();
    const q      = this.search().toLowerCase();
    const sortBy = this.sort();

    let list = PRODUCTS.filter(p => {
      const catMatch    = cat === 'All' || p.category === cat;
      const searchMatch = `${p.name} ${p.category}`.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });

    if (sortBy === 'priceLow')  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'priceHigh') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')    list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  });

  readonly cartCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly delivery = computed(() => this.subtotal() >= 999 ? 0 : 79);

  readonly total = computed(() => this.subtotal() + this.delivery());

  // ── Effects ──────────────────────────────────────────────────────────────
  constructor() {
    effect(() => {
      const lock = this.cartOpen() || !!this.quickView() || this.customOpen() || this.mobileOpen();
      document.body.classList.toggle('no-scroll', lock);
    });

    let toastTimer: ReturnType<typeof setTimeout> | undefined;
    effect(() => {
      const msg = this.toast();
      clearTimeout(toastTimer);
      if (!msg) return;
      toastTimer = setTimeout(() => this.toast.set(''), 2400);
    });
  }

  // ── Cart ─────────────────────────────────────────────────────────────────
  addToCart(product: Product): void {
    this.cart.update(current => {
      const exists = current.find(item => item.id === product.id);
      if (exists) {
        return current.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    this.toast.set(`${product.name} added to your bag`);
  }

  updateQuantity(id: number, amount: number): void {
    this.cart.update(current =>
      current
        .map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
        .filter(item => item.quantity > 0)
    );
  }

  // ── Wishlist ─────────────────────────────────────────────────────────────
  toggleWishlist(id: number): void {
    this.wishlist.update(current =>
      current.includes(id) ? current.filter(i => i !== id) : [...current, id]
    );
  }

  isWishlisted(id: number): boolean {
    return this.wishlist().includes(id);
  }

  // ── Navigation ───────────────────────────────────────────────────────────
  chooseCategory(category: string): void {
    this.activeCategory.set(category);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  }

  clearSearch(): void {
    this.search.set('');
    this.activeCategory.set('All');
  }
}
