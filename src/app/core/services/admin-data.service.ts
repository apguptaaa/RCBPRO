import { Injectable, inject } from '@angular/core';
import {
  AdminAddon, AdminBanner, AdminCategory, AdminProduct, AdminSubcategory,
  AddonDraft, BannerDraft, CategoryDraft, ProductDraft, SubcategoryDraft
} from '../data/admin-catalog.models';
import { ApiClientService } from './api-client.service';

export interface CatalogData {
  products: AdminProduct[];
  categories: AdminCategory[];
  subcategories: AdminSubcategory[];
  addons: AdminAddon[];
  banners: AdminBanner[];
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly api = inject(ApiClientService);

  getPublicCatalog(): Promise<CatalogData> {
    return this.api.get<CatalogData>('/catalog');
  }

  getAdminCatalog(): Promise<CatalogData> {
    return this.api.get<CatalogData>('/admin/catalog');
  }

  saveProduct(draft: ProductDraft): Promise<AdminProduct> {
    return draft.id
      ? this.api.put<AdminProduct>(`/admin/products/${draft.id}`, draft)
      : this.api.post<AdminProduct>('/admin/products', draft);
  }

  deleteProduct(id: number): Promise<void> {
    return this.api.delete(`/admin/products/${id}`);
  }

  saveCategory(draft: CategoryDraft): Promise<AdminCategory> {
    return draft.id
      ? this.api.put<AdminCategory>(`/admin/categories/${encodeURIComponent(draft.id)}`, draft)
      : this.api.post<AdminCategory>('/admin/categories', draft);
  }

  deleteCategory(id: string): Promise<void> {
    return this.api.delete(`/admin/categories/${encodeURIComponent(id)}`);
  }

  saveSubcategory(draft: SubcategoryDraft): Promise<AdminSubcategory> {
    return draft.id
      ? this.api.put<AdminSubcategory>(`/admin/subcategories/${encodeURIComponent(draft.id)}`, draft)
      : this.api.post<AdminSubcategory>('/admin/subcategories', draft);
  }

  deleteSubcategory(id: string): Promise<void> {
    return this.api.delete(`/admin/subcategories/${encodeURIComponent(id)}`);
  }

  saveAddon(draft: AddonDraft): Promise<AdminAddon> {
    return draft.id
      ? this.api.put<AdminAddon>(`/admin/addons/${encodeURIComponent(draft.id)}`, draft)
      : this.api.post<AdminAddon>('/admin/addons', draft);
  }

  deleteAddon(id: string): Promise<void> {
    return this.api.delete(`/admin/addons/${encodeURIComponent(id)}`);
  }

  saveBanner(draft: BannerDraft): Promise<AdminBanner> {
    return draft.id
      ? this.api.put<AdminBanner>(`/admin/banners/${encodeURIComponent(draft.id)}`, draft)
      : this.api.post<AdminBanner>('/admin/banners', draft);
  }

  deleteBanner(id: string): Promise<void> {
    return this.api.delete(`/admin/banners/${encodeURIComponent(id)}`);
  }

  async uploadImage(file: File): Promise<string> {
    const dataUrl = await this.readImage(file);
    return this.compressImage(dataUrl);
  }

  private readImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('The image could not be read.'));
      reader.onerror = () => reject(new Error('The image could not be read.'));
      reader.readAsDataURL(file);
    });
  }

  private compressImage(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Image processing is unavailable in this browser.'));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.onerror = () => reject(new Error('The selected file is not a valid image.'));
      image.src = dataUrl;
    });
  }
}
