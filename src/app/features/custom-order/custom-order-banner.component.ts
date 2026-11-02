import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import { LucideCheck, LucideArrowRight } from '@lucide/angular';

@Component({
  selector: 'app-custom-order-banner',
  standalone: true,
  imports: [LucideCheck, LucideArrowRight],
  templateUrl: './custom-order-banner.component.html'
})
export class CustomOrderBannerComponent {
  readonly store = inject(StoreService);
  readonly features = ['100% eggless', 'Freshly made to order', 'Personalised design', 'Made for Gwalior'];
}
