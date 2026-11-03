import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
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

  browseTreats(): void {
    this.store.cartOpen.set(false);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  }

  checkout(): void {
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

    this.openWhatsApp(message);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  private openWhatsApp(message: string): void {
    const url = `https://wa.me/919131138005?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
