import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../core/services/store.service';
import { FormatPricePipe } from '../../core/pipes/format-price.pipe';
import {
  LucideHeart,
  LucideStar,
  LucideSearchX
} from '@lucide/angular';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [FormsModule, DecimalPipe, RouterLink, FormatPricePipe, LucideHeart, LucideStar, LucideSearchX],
  templateUrl: './shop.component.html'
})
export class ShopComponent {
  readonly store = inject(StoreService);
  readonly featuredProducts = computed(() => this.store.filteredProducts().slice(0, 4));

  readonly filterChips = computed(() => ['All', ...this.store.categories().map(category => category.name)]);

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
