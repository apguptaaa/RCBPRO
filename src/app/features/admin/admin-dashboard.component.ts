import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LucideCakeSlice, LucideImage, LucideLogOut, LucideTags, LucideTrash2, LucideClipboardList, LucideStar } from '@lucide/angular';
import {
  AdminAddon, AdminBanner, AdminCategory, AdminProduct, AdminSubcategory,
  AddonDraft, BannerDraft, CategoryDraft, ProductDraft, SubcategoryDraft
} from '../../core/data/admin-catalog.models';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { AdminDataService } from '../../core/services/admin-data.service';
import { StoreService } from '../../core/services/store.service';
import { AccountDataService, CustomOrderRequest, OrderInquiry } from '../../core/services/account-data.service';
import { AdminReview, ReviewDraft } from '../../core/data/review.models';
import { ReviewDataService } from '../../core/services/review-data.service';

type AdminSection = 'products' | 'categories' | 'addons' | 'banners' | 'orders' | 'reviews';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe, LucideCakeSlice, LucideImage, LucideLogOut, LucideTags, LucideTrash2, LucideClipboardList, LucideStar],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  readonly auth = inject(AdminAuthService);
  private readonly data = inject(AdminDataService);
  private readonly accountData = inject(AccountDataService);
  private readonly reviewData = inject(ReviewDataService);
  readonly store = inject(StoreService);
  readonly section = signal<AdminSection>('products');
  readonly products = signal<AdminProduct[]>([]);
  readonly categories = signal<AdminCategory[]>([]);
  readonly subcategories = signal<AdminSubcategory[]>([]);
  readonly addons = signal<AdminAddon[]>([]);
  readonly banners = signal<AdminBanner[]>([]);
  readonly inquiries = signal<OrderInquiry[]>([]);
  readonly customOrders = signal<CustomOrderRequest[]>([]);
  readonly reviews = signal<AdminReview[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly inquiriesLoading = signal(false);

  productDraft: ProductDraft = this.emptyProduct();
  categoryDraft: CategoryDraft = this.emptyCategory();
  subcategoryDraft: SubcategoryDraft = this.emptySubcategory();
  addonDraft: AddonDraft = this.emptyAddon();
  bannerDraft: BannerDraft = this.emptyBanner();
  reviewDraft: ReviewDraft = this.emptyReview();

  ngOnInit(): void {
    void this.load();
  }

  async openSection(section: AdminSection): Promise<void> {
    this.section.set(section);
    if (section === 'reviews') {
      this.inquiriesLoading.set(true);
      this.error.set('');
      try {
        this.reviews.set(await this.reviewData.getAdminReviews());
      } catch (error) {
        this.error.set(this.errorMessage(error));
      } finally {
        this.inquiriesLoading.set(false);
      }
      return;
    }
    if (section !== 'orders') return;
    this.inquiriesLoading.set(true);
    this.error.set('');
    try {
      const [inquiries, customOrders] = await Promise.all([
        this.accountData.listOrderInquiries(),
        this.accountData.listCustomOrders()
      ]);
      this.inquiries.set(inquiries);
      this.customOrders.set(customOrders);
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.inquiriesLoading.set(false);
    }
  }

  async updateInquiryStatus(inquiry: OrderInquiry, event: Event): Promise<void> {
    const status = (event.target as HTMLSelectElement).value as OrderInquiry['status'];
    this.saving.set(true);
    this.error.set('');
    try {
      await this.accountData.updateOrderInquiryStatus(inquiry.id, status);
      this.inquiries.update(current => current.map(item =>
        item.id === inquiry.id ? { ...item, status } : item
      ));
      this.store.toast.set('Order request status updated.');
    } catch (error) {
      this.error.set(this.errorMessage(error));
      (event.target as HTMLSelectElement).value = inquiry.status;
    } finally {
      this.saving.set(false);
    }
  }

  async updateCustomOrderStatus(order: CustomOrderRequest, event: Event): Promise<void> {
    const status = (event.target as HTMLSelectElement).value as CustomOrderRequest['status'];
    this.saving.set(true);
    this.error.set('');
    try {
      await this.accountData.updateCustomOrderStatus(order.id, status);
      this.customOrders.update(current => current.map(item =>
        item.id === order.id ? { ...item, status } : item
      ));
      this.store.toast.set('Custom cake request status updated.');
    } catch (error) {
      this.error.set(this.errorMessage(error));
      (event.target as HTMLSelectElement).value = order.status;
    } finally {
      this.saving.set(false);
    }
  }

  formatInquiryDetails(details: Record<string, unknown>): string {
    return JSON.stringify(details, null, 2);
  }

  editReview(review: AdminReview): void {
    this.reviewDraft = { ...review };
  }

  async saveReview(): Promise<void> {
    await this.runSave(async () => {
      await this.reviewData.saveReview({
        ...this.reviewDraft,
        rating: Number(this.reviewDraft.rating)
      });
      this.reviewDraft = this.emptyReview();
      this.reviews.set(await this.reviewData.getAdminReviews());
    }, 'Review saved.');
  }

  async deleteReview(id: string): Promise<void> {
    await this.runSave(async () => {
      await this.reviewData.deleteReview(id);
      this.reviews.set(await this.reviewData.getAdminReviews());
    }, 'Review deleted.');
  }

  async load(): Promise<boolean> {
    this.loading.set(true);
    this.error.set('');
    try {
      const catalog = await this.data.getAdminCatalog();
      this.products.set(catalog.products);
      this.categories.set(catalog.categories);
      this.subcategories.set(catalog.subcategories);
      this.addons.set(catalog.addons);
      this.banners.set(catalog.banners);
      return true;
    } catch (error) {
      this.error.set(this.errorMessage(error));
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  editProduct(product: AdminProduct): void {
    this.section.set('products');
    this.productDraft = { ...product };
    this.store.toast.set(`Editing ${product.name}`);
  }

  async saveProduct(): Promise<void> {
    await this.runSave(async () => {
      await this.data.saveProduct({
        ...this.productDraft,
        subcategory: this.productDraft.subcategory || '',
        old_price: Number(this.productDraft.old_price),
        price: Number(this.productDraft.price)
      });
      this.productDraft = this.emptyProduct();
      if (!await this.load()) throw new Error('Product was saved, but the list could not be refreshed.');
      await this.store.refreshProducts();
    }, 'Product saved.');
  }

  subcategoriesForProduct(): AdminSubcategory[] {
    const category = this.categories().find(item => item.name === this.productDraft.category);
    return category
      ? this.subcategories().filter(item => item.categoryId === category.id && item.active)
      : [];
  }

  editCategory(category: AdminCategory): void {
    this.section.set('categories');
    this.categoryDraft = { ...category };
    this.store.toast.set(`Editing ${category.name}`);
  }

  async saveCategory(): Promise<void> {
    await this.runSave(async () => {
      await this.data.saveCategory(this.categoryDraft);
      this.categoryDraft = this.emptyCategory();
      if (!await this.load()) throw new Error('Category was saved, but the list could not be refreshed.');
      await this.store.refreshCatalog();
    }, 'Category saved and shown in Shop by category.');
  }

  async deleteCategory(id: string): Promise<void> {
    await this.runSave(async () => {
      await this.data.deleteCategory(id);
      if (!await this.load()) throw new Error('Category was deleted, but the list could not be refreshed.');
      await this.store.refreshCatalog();
    }, 'Category deleted.');
  }

  editSubcategory(subcategory: AdminSubcategory): void {
    this.section.set('categories');
    this.subcategoryDraft = { ...subcategory };
    this.store.toast.set(`Editing ${subcategory.name}`);
  }

  async saveSubcategory(): Promise<void> {
    await this.runSave(async () => {
      await this.data.saveSubcategory(this.subcategoryDraft);
      this.subcategoryDraft = this.emptySubcategory();
      if (!await this.load()) throw new Error('Subcategory was saved, but the list could not be refreshed.');
      await this.store.refreshCatalog();
    }, 'Subcategory saved and shown in Shop by category.');
  }

  async deleteSubcategory(id: string): Promise<void> {
    await this.runSave(async () => {
      await this.data.deleteSubcategory(id);
      if (!await this.load()) throw new Error('Subcategory was deleted, but the list could not be refreshed.');
      await this.store.refreshCatalog();
    }, 'Subcategory deleted.');
  }

  editAddon(addon: AdminAddon): void {
    this.addonDraft = { ...addon };
    this.store.toast.set(`Editing ${addon.name}`);
  }

  async saveAddon(): Promise<void> {
    await this.runSave(async () => {
      await this.data.saveAddon({
        ...this.addonDraft,
        product_id: this.addonDraft.product_id ? Number(this.addonDraft.product_id) : null,
        price: Number(this.addonDraft.price)
      });
      this.addonDraft = this.emptyAddon();
      if (!await this.load()) throw new Error('Add-on was saved, but the list could not be refreshed.');
      await this.store.refreshCatalog();
    }, 'Add-on saved.');
  }

  editBanner(banner: AdminBanner): void {
    this.bannerDraft = { ...banner };
    this.store.toast.set(`Editing ${banner.title}`);
  }

  async saveBanner(): Promise<void> {
    await this.runSave(async () => {
      await this.data.saveBanner(this.bannerDraft);
      this.bannerDraft = this.emptyBanner();
      if (!await this.load()) throw new Error('Banner was saved, but the list could not be refreshed.');
      await this.store.refreshCatalog();
    }, 'Banner saved.');
  }

  async deleteProduct(id: number): Promise<void> {
    await this.runSave(async () => {
      await this.data.deleteProduct(id);
      if (!await this.load()) throw new Error('Product was deleted, but the list could not be refreshed.');
      await this.store.refreshProducts();
    }, 'Product deleted.');
  }

  async deleteAddon(id: string): Promise<void> {
    await this.runSave(async () => {
      await this.data.deleteAddon(id);
      if (!await this.load()) throw new Error('Add-on was deleted, but the list could not be refreshed.');
      await this.store.refreshCatalog();
    }, 'Add-on deleted.');
  }

  async deleteBanner(id: string): Promise<void> {
    await this.runSave(async () => {
      await this.data.deleteBanner(id);
      if (!await this.load()) throw new Error('Banner was deleted, but the list could not be refreshed.');
      await this.store.refreshCatalog();
    }, 'Banner deleted.');
  }

  async uploadImage(event: Event, target: 'product' | 'category' | 'subcategory' | 'addon' | 'banner' | 'review'): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.error.set('Select an image file.');
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.error.set('Image must be 5 MB or smaller.');
      input.value = '';
      return;
    }

    this.error.set('');
    this.saving.set(true);
    try {
      const image = await this.data.uploadImage(file);
      if (target === 'product') this.productDraft.image = image;
      if (target === 'category') this.categoryDraft.image = image;
      if (target === 'subcategory') this.subcategoryDraft.image = image;
      if (target === 'addon') this.addonDraft.image = image;
      if (target === 'banner') this.bannerDraft.image = image;
      if (target === 'review') this.reviewDraft.avatar = image;
      this.store.toast.set('Image ready. Save the form to upload it.');
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.saving.set(false);
      input.value = '';
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      this.error.set(this.errorMessage(error));
    }
  }

  private async runSave(action: () => Promise<void>, success: string): Promise<void> {
    this.saving.set(true);
    this.error.set('');
    try {
      await action();
      this.store.toast.set(success);
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'The requested change could not be saved.';
  }

  emptyProduct(): ProductDraft {
    return {
      name: '',
      category: '',
      price: 0,
      old_price: 0,
      oldPrice: 0,
      rating: 5,
      reviews: 0,
      badge: '',
      veg: true,
      image: '',
      description: '',
      active: true,
      subcategory: ''
    };
  }

  emptyCategory(): CategoryDraft {
    return { name: '', image: '', active: true };
  }

  emptySubcategory(): SubcategoryDraft {
    return { categoryId: this.categories()[0]?.id ?? '', name: '', image: '', active: true };
  }

  emptyAddon(): AddonDraft {
    return { name: '', description: '', price: 0, image: '', active: true, product_id: null };
  }

  emptyBanner(): BannerDraft {
    return { title: '', subtitle: '', image: '', link: '/', active: true };
  }

  emptyReview(): ReviewDraft {
    return { name: '', quote: '', avatar: '', rating: 5, active: true };
  }
}
