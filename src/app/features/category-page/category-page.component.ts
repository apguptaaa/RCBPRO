import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideHeart, LucideStar } from '@lucide/angular';
import { FormatPricePipe } from '../../core/pipes/format-price.pipe';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormatPricePipe, LucideHeart, LucideStar],
  templateUrl: './category-page.component.html'
})
export class CategoryPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(StoreService);
  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  readonly categoryName = computed(() => this.routeParams().get('category') ?? 'All Cakes');
  readonly category = computed(() =>
    this.store.categories().find(item => item.name === this.categoryName()) ?? null
  );
  readonly products = computed(() =>
    this.category()
      ? this.store.products().filter(item =>
        item.category === this.categoryName() || item.subcategory === this.categoryName()
      )
      : this.categoryName() === 'All Cakes'
        ? this.store.products()
        : []
  );
}
