import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../core/services/store.service';
import { FormatPricePipe } from '../../core/pipes/format-price.pipe';
import { CATEGORY_DATA } from '../../core/data/catalog.data';
import {
  LucideHeart,
  LucideStar,
  LucideShoppingBag,
  LucideSearchX
} from '@lucide/angular';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [FormsModule, FormatPricePipe, LucideHeart, LucideStar, LucideShoppingBag, LucideSearchX],
  templateUrl: './shop.component.html'
})
export class ShopComponent {
  readonly store = inject(StoreService);

  readonly filterChips = ['All', ...CATEGORY_DATA.map(c => c.name)];

  readonly sortOptions = [
    { value: 'popular',    label: 'Most popular'        },
    { value: 'rating',     label: 'Top rated'           },
    { value: 'priceLow',   label: 'Price: low to high'  },
    { value: 'priceHigh',  label: 'Price: high to low'  },
  ];

  get sortModel(): string { return this.store.sort(); }
  set sortModel(v: string) { this.store.sort.set(v); }

  animDelay(index: number): string {
    return `${Math.min(index * 45, 250)}ms`;
  }
}
