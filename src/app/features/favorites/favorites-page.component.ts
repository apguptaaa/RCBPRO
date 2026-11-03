import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideHeart, LucideStar } from '@lucide/angular';
import { DecimalPipe } from '@angular/common';
import { FormatPricePipe } from '../../core/pipes/format-price.pipe';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormatPricePipe, LucideHeart, LucideStar],
  templateUrl: './favorites-page.component.html'
})
export class FavoritesPageComponent {
  readonly store = inject(StoreService);
  readonly products = computed(() =>
    this.store.products().filter(product => this.store.wishlist().includes(product.id))
  );
}
