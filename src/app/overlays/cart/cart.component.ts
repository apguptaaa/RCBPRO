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
    this.store.toast.set('Checkout is ready for payment integration');
  }
}
