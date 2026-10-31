import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../core/services/store.service';
import {
  LucideMapPin,
  LucideSearch,
  LucideCheck,
  LucideClock3,
  LucideStar
} from '@lucide/angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    FormsModule,
    LucideMapPin,
    LucideSearch,
    LucideCheck,
    LucideClock3,
    LucideStar
  ],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  readonly store = inject(StoreService);

  readonly cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Jaipur'];

  /** Two-way bridge between ngModel and the store signal */
  get locationModel(): string {
    return this.store.location();
  }
  set locationModel(value: string) {
    this.store.location.set(value);
  }

  /** Two-way bridge for search input */
  get searchModel(): string {
    return this.store.search();
  }
  set searchModel(value: string) {
    this.store.search.set(value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  }
}
