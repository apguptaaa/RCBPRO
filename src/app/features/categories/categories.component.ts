import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html'
})
export class CategoriesComponent {
  private readonly store = inject(StoreService);
  readonly categories = computed(() => this.store.categories());
  private readonly router = inject(Router);

  viewAll(): void {
    void this.router.navigateByUrl('/cakes');
  }

  pick(name: string): void {
    void this.router.navigate(['/cakes', name]);
  }
}
