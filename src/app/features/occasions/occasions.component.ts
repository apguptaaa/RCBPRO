import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import { Occasion } from '../../core/models/product.model';
import { OCCASIONS } from '../../core/data/catalog.data';
import { LucideArrowRight } from '@lucide/angular';

const OCCASION_CATEGORIES = ['Birthday Cakes', 'Anniversary', 'Flower Bouquets'];

@Component({
  selector: 'app-occasions',
  standalone: true,
  imports: [LucideArrowRight],
  templateUrl: './occasions.component.html'
})
export class OccasionsComponent {
  readonly store = inject(StoreService);
  readonly occasions: Occasion[] = OCCASIONS;

  pick(index: number): void {
    this.store.chooseCategory(OCCASION_CATEGORIES[index]);
  }
}
