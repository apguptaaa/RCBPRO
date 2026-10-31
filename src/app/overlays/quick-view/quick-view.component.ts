import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import { FormatPricePipe } from '../../core/pipes/format-price.pipe';
import {
  LucideX,
  LucideStar,
  LucideTruck,
  LucideShoppingBag
} from '@lucide/angular';

@Component({
  selector: 'app-quick-view',
  standalone: true,
  imports: [FormatPricePipe, LucideX, LucideStar, LucideTruck, LucideShoppingBag],
  templateUrl: './quick-view.component.html'
})
export class QuickViewComponent {
  readonly store = inject(StoreService);
  readonly stars = [1, 2, 3, 4, 5];

  addAndClose(): void {
    const product = this.store.quickView();
    if (!product) return;
    this.store.addToCart(product);
    this.store.quickView.set(null);
  }
}
