import { Component, inject } from '@angular/core';
import { LucideArrowUpRight } from '@lucide/angular';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [LucideArrowUpRight],
  templateUrl: './promo-banner.component.html'
})
export class PromoBannerComponent {
  readonly store = inject(StoreService);
}
