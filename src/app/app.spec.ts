import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { StoreService } from './core/services/store.service';
import { AdminAuthService } from './core/services/admin-auth.service';
import { AdminDataService } from './core/services/admin-data.service';
import { PRODUCTS } from './core/data/catalog.data';

describe('App', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    localStorage.removeItem('crumb-bloom-demo-products');
    localStorage.removeItem('crumb-bloom-demo-categories');
    localStorage.removeItem('crumb-bloom-demo-subcategories');
    localStorage.removeItem('crumb-bloom-demo-addons');
    localStorage.removeItem('crumb-bloom-demo-banners');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should render the home route', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Fresh cakes for');
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

  it('should allow the documented demo admin credentials', async () => {
    const auth = TestBed.inject(AdminAuthService);
    const error = await auth.signIn('admin@crumbandbloom.com', 'admin123');
    expect(error).toBeNull();
    expect(await auth.hasAdminAccess()).toBe(true);
    expect(TestBed.inject(Router).url).toBe('/admin');
    await auth.signOut();
  });

  it('should show an active Admin panel navbar item only after admin login', async () => {
    const auth = TestBed.inject(AdminAuthService);
    await auth.signIn('admin@crumbandbloom.com', 'admin123');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const adminLink = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')]
      .find(link => link.textContent?.trim() === 'Admin panel');
    expect(adminLink).toBeTruthy();
    expect(adminLink?.getAttribute('aria-current')).toBe('page');
    await auth.signOut();
  });

  it('should not grant admin access or show an admin menu to the demo customer', async () => {
    const auth = TestBed.inject(AdminAuthService);
    await auth.signIn('customer@crumbandbloom.com', 'user123');
    expect(auth.role()).toBe('customer');
    expect(await auth.hasAdminAccess()).toBe(false);

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Admin panel');
  });

  it('should save demo products, add-ons, and banners in browser storage', () => {
    const data = TestBed.inject(AdminDataService);
    const initialProductCount = data.listProducts().length;
    data.saveProduct({
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
    });
    expect(data.listProducts()).toHaveLength(initialProductCount + 1);
    expect(data.listProducts().at(-1)?.name).toBe('Demo test cake');

    data.saveAddon({ name: 'Demo candle', description: '', price: 30, image: '', active: true, product_id: null });
    expect(data.listAddons().map(addon => addon.name)).toContain('Demo candle');

    data.saveBanner({ title: 'Demo banner', subtitle: '', image: 'https://example.com/banner.jpg', link: '/', active: true });
    expect(data.listBanners().map(banner => banner.title)).toContain('Demo banner');
  });

  it('should add categories and subcategories for the storefront category strip', async () => {
    const data = TestBed.inject(AdminDataService);
    const category = { name: 'Wedding Cakes', image: 'data:image/jpeg;base64,demo', active: true };
    data.saveCategory(category);
    const savedCategory = data.listCategories().find(item => item.name === category.name);
    expect(savedCategory).toBeTruthy();

    data.saveSubcategory({
      categoryId: savedCategory!.id,
      name: 'Floral Wedding Cakes',
      image: '',
      active: true
    });
    expect(data.listSubcategories().map(item => item.name)).toContain('Floral Wedding Cakes');

    await TestBed.inject(StoreService).refreshCatalog();
    expect(TestBed.inject(StoreService).categories().map(item => item.name))
      .toContain('Floral Wedding Cakes');
  });
});
