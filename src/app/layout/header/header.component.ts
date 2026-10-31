import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../core/services/store.service';
import {
  LucideMenu,
  LucideCakeSlice,
  LucideMapPin,
  LucideUserRound,
  LucideHeart,
  LucideShoppingBag
} from '@lucide/angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    LucideMenu,
    LucideCakeSlice,
    LucideMapPin,
    LucideUserRound,
    LucideHeart,
    LucideShoppingBag
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  readonly store = inject(StoreService);

  readonly cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Jaipur'];

  /** Two-way bridge between ngModel and the store signal */
  get locationModel(): string {
    return this.store.location();
  }
  set locationModel(value: string) {
    this.store.location.set(value);
  }
}
