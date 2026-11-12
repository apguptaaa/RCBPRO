import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartItem, Category, Product } from '../models/product.model';
import { CATEGORY_DATA, PRODUCTS } from '../data/catalog.data';
import { AdminAddon, AdminBanner } from '../data/admin-catalog.models';
import { AdminDataService } from './admin-data.service';
import { AdminAuthService } from './admin-auth.service';
import { AccountDataService } from './account-data.service';

type CartLineKey = Pick<CartItem, 'id' | 'variant' | 'message'>;

function cartLineKey(item: CartLineKey): string {
  return JSON.stringify([
    item.id,
    item.variant?.trim() || '',
    item.message?.trim() || ''
  ]);
}

function mergeCartItems(items: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of items) {
    const key = cartLineKey(item);
    const existing = merged.get(key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.set(key, { ...item });
    }
  }

  return [...merged.values()];
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly adminData = inject(AdminDataService);
  private readonly auth = inject(AdminAuthService);
  private readonly accountData = inject(AccountDataService);
  private cartSync: Promise<void> = Promise.resolve();
  private favoritesSync: Promise<void> = Promise.resolve();
  private connectedAccount = '';
  readonly products     = signal<Product[]>(PRODUCTS.map(product => ({ ...product })));
  readonly categories = signal<Category[]>(CATEGORY_DATA.map(category => ({ ...category })));
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

  readonly cartCount = computed(() => this.cart().length);

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
      const apiProducts = products.map(({ old_price, active: _active, ...product }) => ({
        ...product,
        oldPrice: old_price
      }));
      const productsById = new Map<number, Product>();
      for (const product of apiProducts) productsById.set(product.id, product);
      for (const product of PRODUCTS) {
        if (!productsById.has(product.id)) productsById.set(product.id, product);
      }
      this.products.set([...productsById.values()]);
      const categoriesFromApi = [
        ...categories.map(({ name, image }) => ({ name, image })),
        ...subcategories
          .filter(subcategory => categories.some(category => category.id === subcategory.categoryId))
          .map(subcategory => ({
            name: subcategory.name,
            image: subcategory.image || categories.find(category => category.id === subcategory.categoryId)?.image || '',
            parentName: categories.find(category => category.id === subcategory.categoryId)?.name
          }))
      ];
      const categoriesByName = new Map(
        CATEGORY_DATA.map(category => [category.name.toLowerCase(), { ...category }])
      );
      for (const category of categoriesFromApi) {
        categoriesByName.set(category.name.toLowerCase(), {
          ...category,
          image: category.image || CATEGORY_DATA.find(item => item.name === category.name)?.image || ''
        });
      }
      this.categories.set([...categoriesByName.values()]);
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
    const item = {
      ...product,
      variant: options.variant?.trim() || undefined,
      message: options.message?.trim() || undefined
    };
    this.cart.update(current => {
      const merged = mergeCartItems(current);
      const key = cartLineKey(item);
      const existing = merged.find(cartItem => cartLineKey(cartItem) === key);
      if (existing) {
        return merged.map(cartItem =>
          cartLineKey(cartItem) === key
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...merged, { ...item, quantity: 1 }];
    });
    this.toast.set(`${product.name} added to your bag`);
    this.cartOpen.set(true);
    this.persistCart();
  }

  updateQuantity(id: number, amount: number, variant?: string, message?: string): void {
    const key = cartLineKey({ id, variant, message });
    this.cart.update(current =>
      mergeCartItems(current)
        .map(item =>
          cartLineKey(item) === key
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0)
    );
    this.persistCart();
  }

  removeFromCart(id: number, variant?: string, message?: string): void {
    const key = cartLineKey({ id, variant, message });
    this.cart.update(current => current.filter(item => cartLineKey(item) !== key));
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
        const existing = mergedCart.find(item => cartLineKey(item) === cartLineKey(guestItem));
        if (existing) {
          existing.quantity = Math.min(99, existing.quantity + guestItem.quantity);
        } else {
          mergedCart.push(guestItem);
        }
      }
      this.cart.set(mergeCartItems(mergedCart));
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
    const productIds = this.wishlist().filter(id => id > 0);
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
