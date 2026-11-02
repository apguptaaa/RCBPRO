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
