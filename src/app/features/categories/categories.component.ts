import { Component, inject } from '@angular/core';
import { LucideArrowRight } from '@lucide/angular';
import { StoreService } from '../../core/services/store.service';
import { Category } from '../../core/models/product.model';
import { CATEGORY_DATA } from '../../core/data/catalog.data';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [LucideArrowRight],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent {
  readonly store = inject(StoreService);
  readonly categories: Category[] = CATEGORY_DATA;

  viewAll(): void { this.store.chooseCategory('All'); }
  pick(name: string): void { this.store.chooseCategory(name); }
}
