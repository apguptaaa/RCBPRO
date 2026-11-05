import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartItem, Category, Product } from '../models/product.model';
import { AdminAddon, AdminBanner } from '../data/admin-catalog.models';
import { AdminDataService } from './admin-data.service';
import { AdminAuthService } from './admin-auth.service';
import { AccountDataService } from './account-data.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly adminData = inject(AdminDataService);
  private readonly auth = inject(AdminAuthService);
  private readonly accountData = inject(AccountDataService);
  private cartSync: Promise<void> = Promise.resolve();
  private favoritesSync: Promise<void> = Promise.resolve();
  private connectedAccount = '';
  readonly products     = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly addons = signal<AdminAddon[]>([]);
  readonly banners = signal<AdminBanner[]>([]);
  readonly catalogError = signal('');

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

    effect(() => {
      if (!this.auth.ready()) return;
      const email = this.auth.user()?.email ?? '';
      if (email && email !== this.connectedAccount) {
        this.connectedAccount = email;
        void this.loadAccountData();
      } else if (!email && this.connectedAccount) {
        this.connectedAccount = '';
        this.cart.set([]);
        this.wishlist.set([]);
      }
    });
  }

  async refreshCatalog(): Promise<void> {
    try {
      const { products, categories, subcategories, addons, banners } = await this.adminData.getPublicCatalog();
      this.products.set(products.map(({ old_price, active: _active, ...product }) => ({
        ...product,
        oldPrice: old_price
      })));
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
      this.addons.set(addons);
      this.banners.set(banners);
      this.catalogError.set('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The product catalog could not be loaded.';
      this.catalogError.set(message);
      console.error('Could not load catalog data:', error);
    }
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
    this.persistCart();
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
    this.persistCart();
  }

  // ── Wishlist ─────────────────────────────────────────────────────────────
  toggleWishlist(id: number): void {
    this.wishlist.update(current =>
      current.includes(id) ? current.filter(i => i !== id) : [...current, id]
    );
    this.persistFavorites();
  }

  isWishlisted(id: number): boolean {
    return this.wishlist().includes(id);
  }

  private async loadAccountData(): Promise<void> {
    try {
      const [savedCart, savedFavorites] = await Promise.all([
        this.accountData.getCart(),
        this.accountData.getFavorites()
      ]);
      const mergedCart = [...savedCart.items];
      for (const guestItem of this.cart()) {
        const existing = mergedCart.find(item =>
          item.id === guestItem.id &&
          item.variant === guestItem.variant &&
          item.message === guestItem.message
        );
        if (existing) {
          existing.quantity = Math.min(99, existing.quantity + guestItem.quantity);
        } else {
          mergedCart.push(guestItem);
        }
      }
      this.cart.set(mergedCart);
      this.wishlist.set([...new Set([...savedFavorites.product_ids, ...this.wishlist()])]);
      this.persistCart();
      this.persistFavorites();
    } catch (error) {
      this.toast.set(error instanceof Error ? error.message : 'Your saved bag and favorites could not be loaded.');
      console.error('Could not load account data:', error);
    }
  }

  private persistCart(): void {
    if (!this.auth.user()) return;
    const items = this.cart().map(item => ({ ...item }));
    this.cartSync = this.cartSync
      .then(() => this.accountData.saveCart(items).then(() => undefined))
      .catch(error => {
        this.toast.set(error instanceof Error ? error.message : 'Your bag could not be saved.');
        console.error('Could not save account cart:', error);
      });
  }

  private persistFavorites(): void {
    if (!this.auth.user()) return;
    const productIds = [...this.wishlist()];
    this.favoritesSync = this.favoritesSync
      .then(() => this.accountData.saveFavorites(productIds).then(() => undefined))
      .catch(error => {
        this.toast.set(error instanceof Error ? error.message : 'Your favorites could not be saved.');
        console.error('Could not save account favorites:', error);
      });
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
