import { Injectable } from '@angular/core';
import { CATEGORY_DATA, PRODUCTS } from '../data/catalog.data';
import {
  AdminAddon, AdminBanner, AdminCategory, AdminProduct, AdminSubcategory,
  AddonDraft, BannerDraft, CategoryDraft, ProductDraft, SubcategoryDraft
} from '../data/admin-catalog.models';

const PRODUCTS_KEY = 'crumb-bloom-demo-products';
const CATEGORIES_KEY = 'crumb-bloom-demo-categories';
const SUBCATEGORIES_KEY = 'crumb-bloom-demo-subcategories';
const ADDONS_KEY = 'crumb-bloom-demo-addons';
const BANNERS_KEY = 'crumb-bloom-demo-banners';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  listProducts(): AdminProduct[] {
    return this.read(PRODUCTS_KEY, PRODUCTS.map(product => ({ ...product, old_price: product.oldPrice, active: true })));
  }

  saveProduct(draft: ProductDraft): void {
    const products = this.listProducts();
    const id = draft.id ?? Math.max(0, ...products.map(product => product.id)) + 1;
    const product: AdminProduct = {
      ...draft,
      id,
      old_price: Number(draft.old_price),
      price: Number(draft.price),
      rating: Number(draft.rating) || 5,
      reviews: Number(draft.reviews) || 0,
      badge: draft.badge || 'Freshly made',
      veg: true
    };
    this.write(PRODUCTS_KEY, draft.id ? products.map(item => item.id === id ? product : item) : [...products, product]);
  }

  deleteProduct(id: number): void {
    this.write(PRODUCTS_KEY, this.listProducts().filter(product => product.id !== id));
  }

  listCategories(): AdminCategory[] {
    return this.read(CATEGORIES_KEY, CATEGORY_DATA.map(category => ({
      id: this.slug(category.name),
      name: category.name,
      image: category.image,
      active: true
    })));
  }

  saveCategory(draft: CategoryDraft): void {
    const categories = this.listCategories();
    const id = draft.id ?? this.slug(draft.name);
    if (categories.some(category => category.id !== draft.id && category.name.trim().toLowerCase() === draft.name.trim().toLowerCase())) {
      throw new Error('A category with this name already exists.');
    }
    const category: AdminCategory = { ...draft, id, name: draft.name.trim() };
    this.write(CATEGORIES_KEY, draft.id ? categories.map(item => item.id === id ? category : item) : [...categories, category]);
    const previousName = categories.find(item => item.id === id)?.name;
    if (previousName && previousName !== category.name) {
      this.write(PRODUCTS_KEY, this.listProducts().map(product =>
        product.category === previousName ? { ...product, category: category.name } : product
      ));
    }
  }

  deleteCategory(id: string): void {
    const children = this.listSubcategories().filter(subcategory => subcategory.categoryId === id);
    if (children.length) throw new Error('Delete this category’s subcategories before deleting the category.');
    const category = this.listCategories().find(item => item.id === id);
    if (category && this.listProducts().some(product => product.category === category.name)) {
      throw new Error('This category is used by products. Move or delete those products first.');
    }
    this.write(CATEGORIES_KEY, this.listCategories().filter(item => item.id !== id));
  }

  listSubcategories(): AdminSubcategory[] {
    return this.read(SUBCATEGORIES_KEY, []);
  }

  saveSubcategory(draft: SubcategoryDraft): void {
    const subcategories = this.listSubcategories();
    const parentCategory = this.listCategories().find(category => category.id === draft.categoryId);
    if (!parentCategory) throw new Error('Choose a valid parent category.');
    const id = draft.id ?? this.slug(`${draft.categoryId}-${draft.name}`);
    if (subcategories.some(item =>
      item.id !== draft.id &&
      item.categoryId === draft.categoryId &&
      item.name.trim().toLowerCase() === draft.name.trim().toLowerCase()
    )) {
      throw new Error('This subcategory already exists under the selected category.');
    }
    const subcategory: AdminSubcategory = { ...draft, id, name: draft.name.trim() };
    const previous = subcategories.find(item => item.id === id);
    const previousParentName = previous
      ? this.listCategories().find(category => category.id === previous.categoryId)?.name
      : undefined;
    this.write(SUBCATEGORIES_KEY, draft.id
      ? subcategories.map(item => item.id === id ? subcategory : item)
      : [...subcategories, subcategory]);
    if (previous && (previous.name !== subcategory.name || previous.categoryId !== subcategory.categoryId)) {
      this.write(PRODUCTS_KEY, this.listProducts().map(product =>
        product.subcategory === previous.name && product.category === previousParentName
          ? { ...product, subcategory: subcategory.name, category: parentCategory.name }
          : product
      ));
    }
  }

  deleteSubcategory(id: string): void {
    const subcategory = this.listSubcategories().find(item => item.id === id);
    const parentCategory = subcategory && this.listCategories().find(item => item.id === subcategory.categoryId);
    if (subcategory && this.listProducts().some(product =>
      product.subcategory === subcategory.name && product.category === parentCategory?.name
    )) {
      throw new Error('This subcategory is used by products. Move or delete those products first.');
    }
    this.write(SUBCATEGORIES_KEY, this.listSubcategories().filter(item => item.id !== id));
  }

  listAddons(): AdminAddon[] {
    return this.read(ADDONS_KEY, []);
  }

  saveAddon(draft: AddonDraft): void {
    const addons = this.listAddons();
    const id = draft.id ?? crypto.randomUUID();
    const addon: AdminAddon = { ...draft, id, price: Number(draft.price) };
    this.write(ADDONS_KEY, draft.id ? addons.map(item => item.id === id ? addon : item) : [...addons, addon]);
  }

  deleteAddon(id: string): void {
    this.write(ADDONS_KEY, this.listAddons().filter(addon => addon.id !== id));
  }

  listBanners(): AdminBanner[] {
    return this.read(BANNERS_KEY, []);
  }

  saveBanner(draft: BannerDraft): void {
    const banners = this.listBanners();
    const id = draft.id ?? crypto.randomUUID();
    const banner: AdminBanner = { ...draft, id };
    this.write(BANNERS_KEY, draft.id ? banners.map(item => item.id === id ? banner : item) : [...banners, banner]);
  }

  deleteBanner(id: string): void {
    this.write(BANNERS_KEY, this.listBanners().filter(banner => banner.id !== id));
  }

  async uploadImage(file: File): Promise<string> {
    const dataUrl = await this.readImage(file);
    return this.compressImage(dataUrl);
  }

  private read<T>(key: string, initialValue: T): T {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      this.write(key, initialValue);
      return initialValue;
    }

    try {
      return JSON.parse(stored) as T;
    } catch {
      throw new Error('Demo data could not be read from this browser. Clear the site storage and try again.');
    }
  }

  private write<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      throw new Error('Browser storage is full or unavailable. Try a smaller image or clear some site storage.');
    }
  }

  private slug(value: string): string {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || crypto.randomUUID();
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
