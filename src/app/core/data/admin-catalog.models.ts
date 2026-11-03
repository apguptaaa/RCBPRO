import { Product } from '../models/product.model';

export interface AdminProduct extends Product {
  old_price: number;
  active: boolean;
  subcategory?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  image: string;
  active: boolean;
}

export interface AdminSubcategory {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  active: boolean;
}

export interface AdminAddon {
  id: string;
  product_id: number | null;
  name: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
}

export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
}

export type ProductDraft = Omit<AdminProduct, 'id'> & { id?: number };
export type CategoryDraft = Omit<AdminCategory, 'id'> & { id?: string };
export type SubcategoryDraft = Omit<AdminSubcategory, 'id'> & { id?: string };
export type AddonDraft = Omit<AdminAddon, 'id'> & { id?: string };
export type BannerDraft = Omit<AdminBanner, 'id'> & { id?: string };
