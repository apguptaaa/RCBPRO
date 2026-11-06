import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { AccountDataService } from '../../core/services/account-data.service';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { FormatPricePipe } from '../../core/pipes/format-price.pipe';
import { CartItem } from '../../core/models/product.model';
import {
  LucideX,
  LucideShoppingBag,
  LucideMinus,
  LucidePlus
} from '@lucide/angular';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, FormatPricePipe, LucideX, LucideShoppingBag, LucideMinus, LucidePlus],
  styles: [`
    .cart-item {
      max-height: 12rem;
      opacity: 1;
      transform: translateX(0);
      transition: max-height .4s cubic-bezier(.22, 1, .36, 1),
        opacity .32s ease, transform .4s cubic-bezier(.22, 1, .36, 1),
        margin .4s ease, padding .4s ease, border-color .32s ease;
    }

    .cart-item--removing {
      max-height: 0;
      margin: 0;
      overflow: hidden;
      border-color: transparent;
      opacity: 0;
      padding-bottom: 0;
      transform: translateX(1.5rem);
    }

    .cart-remove-button {
      transition: color .18s ease, transform .18s ease, opacity .18s ease;
    }

    .cart-remove-button:hover {
      transform: rotate(90deg) scale(1.08);
    }

    .cart-remove-button:active {
      transform: scale(.9);
    }
  `],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnDestroy {
  readonly store = inject(StoreService);
  private readonly accountData = inject(AccountDataService);
  private readonly auth = inject(AdminAuthService);
  readonly submitting = signal(false);
  readonly removingItems = signal<Set<string>>(new Set());
  private readonly removalTimers = new Map<string, ReturnType<typeof setTimeout>>();

  ngOnDestroy(): void {
    for (const timer of this.removalTimers.values()) clearTimeout(timer);
  }

  isRemoving(item: CartItem): boolean {
    return this.removingItems().has(this.itemKey(item));
  }

  removeItem(item: CartItem): void {
    const key = this.itemKey(item);
    if (this.removingItems().has(key)) return;

    this.removingItems.update(current => new Set(current).add(key));
    const timer = setTimeout(() => {
      this.store.removeFromCart(item.id, item.variant, item.message);
      this.removingItems.update(current => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
      this.removalTimers.delete(key);
    }, 400);
    this.removalTimers.set(key, timer);
  }

  private itemKey(item: CartItem): string {
    return JSON.stringify([item.id, item.variant?.trim() || '', item.message?.trim() || '']);
  }

  browseTreats(): void {
    this.store.cartOpen.set(false);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  }

  async checkout(): Promise<void> {
    if (this.submitting() || !this.store.cart().length) return;
    const checkoutWindow = window.open('about:blank', '_blank');
    if (!checkoutWindow) {
      this.store.toast.set('Allow pop-ups to continue to WhatsApp.');
      return;
    }
    checkoutWindow.opener = null;
    this.submitting.set(true);
    const lines = this.store.cart().map((item, index) => {
      const details = [
        item.variant ? `Weight/design: ${item.variant}` : '',
        item.message ? `Cake message: ${item.message}` : ''
      ].filter(Boolean);
      return [
        `${index + 1}. ${item.name} × ${item.quantity}`,
        ...details.map(detail => `   ${detail}`),
        `   ${this.formatCurrency(item.price)} each — ${this.formatCurrency(item.price * item.quantity)}`
      ].join('\n');
    });
    const delivery = this.store.delivery() === 0 ? 'Free' : this.formatCurrency(this.store.delivery());
    const message = [
      'Hello! I would like to place this cake order:',
      '',
      ...lines,
      '',
      `Subtotal: ${this.formatCurrency(this.store.subtotal())}`,
      `Delivery: ${delivery}`,
      `Total: ${this.formatCurrency(this.store.total())}`,
      '',
      'Please confirm availability and delivery details.'
    ].join('\n');

    try {
      await this.accountData.createOrderInquiry({
        kind: 'cart',
        customer_name: this.auth.user()?.name,
        details: {
          items: this.store.cart().map(item => ({
            product_id: item.id,
            name: item.name,
            quantity: item.quantity,
            variant: item.variant,
            message: item.message,
            unit_price: item.price
          })),
          subtotal: this.store.subtotal(),
          delivery: this.store.delivery(),
          total: this.store.total()
        }
      });
      checkoutWindow.location.href = this.whatsAppUrl(message);
    } catch (error) {
      checkoutWindow.close();
      this.store.toast.set(error instanceof Error ? error.message : 'Your order request could not be saved.');
    } finally {
      this.submitting.set(false);
    }
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  private whatsAppUrl(message: string): string {
    return `https://wa.me/919131138005?text=${encodeURIComponent(message)}`;
  }
}
