import { Injectable, inject } from '@angular/core';
import { CartItem } from '../models/product.model';
import { ApiClientService } from './api-client.service';

export interface OrderInquiry {
  id: string;
  kind: 'cart' | 'enquiry';
  customer_name: string | null;
  details: Record<string, unknown>;
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface CustomOrderRequest {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  occasion: string;
  flavour: string;
  serving_size: string;
  celebration_date: string;
  design_idea: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class AccountDataService {
  private readonly api = inject(ApiClientService);

  getCart(): Promise<{ items: CartItem[] }> {
    return this.api.get('/account/cart');
  }

  saveCart(items: CartItem[]): Promise<{ items: CartItem[] }> {
    return this.api.put('/account/cart', { items });
  }

  getFavorites(): Promise<{ product_ids: number[] }> {
    return this.api.get('/account/favorites');
  }

  saveFavorites(productIds: number[]): Promise<{ product_ids: number[] }> {
    return this.api.put('/account/favorites', { product_ids: productIds });
  }

  createOrderInquiry(body: unknown): Promise<{ id: string; status: string }> {
    return this.api.post('/order-inquiries', body);
  }

  listOrderInquiries(): Promise<OrderInquiry[]> {
    return this.api.get('/order-inquiries');
  }

  updateOrderInquiryStatus(id: string, status: OrderInquiry['status']): Promise<void> {
    return this.api.patch(`/order-inquiries/${encodeURIComponent(id)}/status`, { status });
  }

  listCustomOrders(): Promise<CustomOrderRequest[]> {
    return this.api.get('/admin/custom-orders');
  }

  updateCustomOrderStatus(id: string, status: CustomOrderRequest['status']): Promise<void> {
    return this.api.patch(`/admin/custom-orders/${encodeURIComponent(id)}/status`, { status });
  }
}
