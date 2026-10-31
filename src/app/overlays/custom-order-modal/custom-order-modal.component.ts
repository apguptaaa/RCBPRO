import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import { LucideX, LucideArrowRight } from '@lucide/angular';

@Component({
  selector: 'app-custom-order-modal',
  standalone: true,
  imports: [LucideX, LucideArrowRight],
  templateUrl: './custom-order-modal.component.html'
})
export class CustomOrderModalComponent {
  readonly store = inject(StoreService);

  onSubmit(event: Event): void {
    event.preventDefault();
    this.store.customOpen.set(false);
    this.store.toast.set('Your custom cake request has been received');
  }
}
