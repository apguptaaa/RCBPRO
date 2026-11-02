import { Component, inject } from '@angular/core';
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

}
