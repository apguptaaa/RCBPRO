import { Component, inject, signal } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import { AccountDataService } from '../../core/services/account-data.service';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { FormatPricePipe } from '../../core/pipes/format-price.pipe';
import {
  LucideX,
  LucideShoppingBag,
  LucideMinus,
  LucidePlus
} from '@lucide/angular';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormatPricePipe, LucideX, LucideShoppingBag, LucideMinus, LucidePlus],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  readonly store = inject(StoreService);
  private readonly accountData = inject(AccountDataService);
  private readonly auth = inject(AdminAuthService);
  readonly submitting = signal(false);

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
