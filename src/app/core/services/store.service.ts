import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartItem, Category, Product } from '../models/product.model';
import { CATEGORY_DATA, PRODUCTS } from '../data/catalog.data';
import { AdminAddon, AdminBanner } from '../data/admin-catalog.models';
import { AdminDataService } from './admin-data.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly adminData = inject(AdminDataService);
  // ── Static catalog ───────────────────────────────────────────────────────
  readonly categoryData = CATEGORY_DATA;
  readonly products     = signal<Product[]>(PRODUCTS);
  readonly categories = signal<Category[]>(CATEGORY_DATA);
  readonly addons = signal<AdminAddon[]>([]);
  readonly banners = signal<AdminBanner[]>([]);

  // ── Overlay state ────────────────────────────────────────────────────────
  readonly mobileOpen = signal(false);
  readonly cartOpen   = signal(false);
  readonly quickView  = signal<Product | null>(null);
  readonly customOpen = signal(false);
  readonly whatsappOpen = signal(false);

  // ── Shop state ───────────────────────────────────────────────────────────
  readonly activeCategory = signal<string>('All');
  readonly search         = signal<string>('');
  readonly sort           = signal<string>('popular');

  // ── Cart & wishlist ──────────────────────────────────────────────────────
  readonly cart     = signal<CartItem[]>([]);
  readonly wishlist = signal<number[]>([]);
  readonly toast    = signal<string>('');

  // ── Derived ──────────────────────────────────────────────────────────────
  readonly filteredProducts = computed(() => {
    const cat    = this.activeCategory();
    const q      = this.search().toLowerCase();
    const sortBy = this.sort();

    let list = this.products().filter(p => {
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
    void this.refreshCatalog();
    effect(() => {
      const lock = this.cartOpen() || !!this.quickView() || this.customOpen() || this.mobileOpen() || this.whatsappOpen();
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

  async refreshCatalog(): Promise<void> {
    const categories = this.adminData.listCategories().filter(category => category.active);
    const subcategories = this.adminData.listSubcategories().filter(subcategory => subcategory.active);
    this.products.set(this.adminData.listProducts()
      .filter(product => product.active)
      .map(({ old_price, active: _active, ...product }) => ({ ...product, oldPrice: old_price })));
    this.categories.set([
      ...categories.map(({ name, image }) => ({ name, image })),
      ...subcategories
        .filter(subcategory => categories.some(category => category.id === subcategory.categoryId))
        .map(subcategory => ({
          name: subcategory.name,
          image: subcategory.image || categories.find(category => category.id === subcategory.categoryId)?.image || '',
          parentName: categories.find(category => category.id === subcategory.categoryId)?.name
        }))
    ]);
    this.addons.set(this.adminData.listAddons().filter(addon => addon.active));
    this.banners.set(this.adminData.listBanners().filter(banner => banner.active));
  }

  async refreshProducts(): Promise<void> {
    await this.refreshCatalog();
  }

  // ── Cart ─────────────────────────────────────────────────────────────────
  addToCart(product: Product, options: { variant?: string; message?: string } = {}): void {
    this.cart.update(current => {
      const exists = current.find(item =>
        item.id === product.id &&
        item.variant === options.variant &&
        item.message === options.message
      );
      if (exists) {
        return current.map(item =>
          item.id === product.id &&
          item.variant === options.variant &&
          item.message === options.message
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, ...options, quantity: 1 }];
    });
    this.toast.set(`${product.name} added to your bag`);
    this.cartOpen.set(true);
  }

  updateQuantity(id: number, amount: number, variant?: string, message?: string): void {
    this.cart.update(current =>
      current
        .map(item =>
          item.id === id && item.variant === variant && item.message === message
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
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
