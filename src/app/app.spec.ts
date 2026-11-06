import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { StoreService } from './core/services/store.service';
import { AdminAuthService } from './core/services/admin-auth.service';
import { AdminDataService } from './core/services/admin-data.service';
import { ApiClientService } from './core/services/api-client.service';
import { PRODUCTS } from './core/data/catalog.data';
import { vi } from 'vitest';

describe('App', () => {
  let apiMock: {
    getToken: ReturnType<typeof vi.fn>;
    setToken: ReturnType<typeof vi.fn>;
    clearToken: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    sessionStorage.clear();
    const catalog = {
      products: PRODUCTS.map(product => ({ ...product, old_price: product.oldPrice, active: true })),
      categories: [{ id: 'birthday-cakes', name: 'Birthday Cakes', image: '', active: true }],
      subcategories: [],
      addons: [],
      banners: []
    };
    apiMock = {
      getToken: vi.fn(() => sessionStorage.getItem('crumb-bloom-access-token')),
      setToken: vi.fn((token: string) => sessionStorage.setItem('crumb-bloom-access-token', token)),
      clearToken: vi.fn(() => sessionStorage.removeItem('crumb-bloom-access-token')),
      get: vi.fn(async (path: string) => {
        if (path === '/reviews') return [];
        if (path === '/account/cart') return { items: [] };
        if (path === '/account/favorites') return { product_ids: [] };
        if (path === '/admin/custom-orders' || path === '/order-inquiries') return [];
        return catalog;
      }),
      post: vi.fn(async (_path: string, body: unknown) => {
        const credentials = body as { email?: string; name?: string };
        const role = credentials.email?.startsWith('admin') ? 'super_admin' : 'customer';
        return {
          token: 'test-token',
          user: { id: 'test-user', email: credentials.email ?? '', name: credentials.name ?? '', role }
        };
      }),
      put: vi.fn(async (_path: string, body: unknown) => body),
      delete: vi.fn(async () => undefined)
    };
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        { provide: ApiClientService, useValue: apiMock }
      ]
    }).compileComponents();
  });

  it('should render the home route', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Fresh cakes for');
  });

  it('should replace the promo banner with a five-slide Diwali carousel below the marquee', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('.promo-indicator')).toHaveLength(5);
    expect(root.querySelector('.promo-title')?.textContent).toContain('Diwali ki mithaas');
    const carousel = root.querySelector('.promo-carousel')!;
    const hero = root.querySelector('app-hero')!;
    const marquee = root.querySelector('app-marquee')!;
    const shop = root.querySelector('app-shop')!;
    expect(hero.compareDocumentPosition(carousel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(marquee.compareDocumentPosition(carousel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(carousel.compareDocumentPosition(shop) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    root.querySelector<HTMLButtonElement>('[aria-label="Next offer"]')?.click();
    fixture.detectChanges();
    expect(root.querySelector('.promo-title')?.textContent).toContain('chocolate');
    expect(root.querySelectorAll('.bakery-texture svg')).toHaveLength(5);
  });

  it('should render a cake detail route without a hash URL', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/products/1');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(router.url).toBe('/products/1');
    const pageText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(pageText).toContain('Royal Chocolate Berry Drip');
    expect(pageText).toContain('Similar cakes');
    expect(pageText).toContain('Product description');
    expect(pageText).toContain('Ratings & reviews');
    expect(pageText).toContain('Questions & answers');
  });

  it('should show products for a selected cake category route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/cakes/Birthday%20Cakes');
    fixture.detectChanges();
    await fixture.whenStable();
    const pageText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(pageText).toContain('Birthday Cakes');
    expect(pageText).toContain('Belgian Choco Strawberry');
  });

  it('should open the bill when a product is added to the cart', () => {
    const store = TestBed.inject(StoreService);
    store.addToCart(PRODUCTS[0]);
    expect(store.cartOpen()).toBe(true);
    expect(store.cartCount()).toBe(1);
  });

  it('should increase quantity instead of adding a duplicate cart line', () => {
    const store = TestBed.inject(StoreService);
    store.addToCart(PRODUCTS[0]);
    store.addToCart(PRODUCTS[0]);

    expect(store.cart()).toHaveLength(1);
    expect(store.cart()[0].quantity).toBe(2);
    expect(store.cartCount()).toBe(1);
  });

  it('should keep separate cart lines for different product options', () => {
    const store = TestBed.inject(StoreService);
    store.addToCart(PRODUCTS[0], { variant: '500 g' });
    store.addToCart(PRODUCTS[0], { variant: '1 kg' });

    expect(store.cart()).toHaveLength(2);
    expect(store.cartCount()).toBe(2);
  });

  it('should remove only the selected product option from the cart', () => {
    const store = TestBed.inject(StoreService);
    store.addToCart(PRODUCTS[0], { variant: '500 g' });
    store.addToCart(PRODUCTS[0], { variant: '1 kg' });

    store.removeFromCart(PRODUCTS[0].id, '500 g');

    expect(store.cart()).toHaveLength(1);
    expect(store.cart()[0].variant).toBe('1 kg');
  });

  it('should open the WhatsApp enquiry form from the floating button', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[aria-label="Ask us on WhatsApp"]').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('should show saved cakes on the favourites route', async () => {
    const store = TestBed.inject(StoreService);
    store.toggleWishlist(PRODUCTS[0].id);
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/favorites');
    fixture.detectChanges();
    await fixture.whenStable();
    const pageText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(pageText).toContain('Your favourites');
    expect(pageText).toContain(PRODUCTS[0].name);
  });

  it('should show the scroll-to-top button after scrolling down', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-label="Scroll to top"]')).toBeNull();

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-label="Scroll to top"]')).toBeTruthy();
  });

  it('should open the welcome panel from the account icon and navigate to login', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[aria-label="Account"]').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-label="Account welcome"]')).toBeTruthy();

    fixture.nativeElement.querySelector('[aria-label="Account welcome"] button').click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/login');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Welcome to Crumb & Bloom');
  });

  it('should redirect unauthenticated visitors away from the admin dashboard', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/admin');
    expect(router.url).toBe('/login');
  });

  it('should grant administrator access from the API role', async () => {
    const auth = TestBed.inject(AdminAuthService);
    const error = await auth.signIn('admin@example.com', 'secure-password');
    expect(error).toBeNull();
    expect(await auth.hasAdminAccess()).toBe(true);
    expect(TestBed.inject(Router).url).toBe('/admin');
    await auth.signOut();
  });

  it('should show an active Admin panel navbar item only after admin login', async () => {
    const auth = TestBed.inject(AdminAuthService);
    await auth.signIn('admin@example.com', 'secure-password');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const adminLink = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')]
      .find(link => link.textContent?.trim() === 'Admin panel');
    expect(adminLink).toBeTruthy();
    expect(adminLink?.getAttribute('aria-current')).toBe('page');
    await auth.signOut();
  });

  it('should not grant admin access or show an admin menu to a customer', async () => {
    const auth = TestBed.inject(AdminAuthService);
    await auth.signIn('customer@example.com', 'secure-password');
    expect(auth.role()).toBe('customer');
    expect(await auth.hasAdminAccess()).toBe(false);

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Admin panel');
  });

  it('should send catalog updates to the backend API', async () => {
    const data = TestBed.inject(AdminDataService);
    const product = {
      name: 'Demo test cake',
      category: 'Test Cakes',
      price: 500,
      old_price: 600,
      oldPrice: 600,
      rating: 5,
      reviews: 0,
      badge: '',
      veg: true,
      image: 'https://example.com/cake.jpg',
      description: 'A test cake',
      active: true
    };
    await data.saveProduct(product);
    expect(apiMock.post).toHaveBeenCalledWith('/admin/products', product);
  });

  it('should load server categories for the storefront category strip', async () => {
    const data = TestBed.inject(AdminDataService);
    await data.getPublicCatalog();
    await TestBed.inject(StoreService).refreshCatalog();
    expect(TestBed.inject(StoreService).categories().map(item => item.name))
      .toContain('Birthday Cakes');
  });
});
