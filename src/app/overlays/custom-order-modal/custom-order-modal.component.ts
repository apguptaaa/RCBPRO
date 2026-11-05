import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import { ApiClientService } from '../../core/services/api-client.service';
import { LucideX, LucideArrowRight } from '@lucide/angular';

@Component({
  selector: 'app-custom-order-modal',
  standalone: true,
  imports: [LucideX, LucideArrowRight],
  templateUrl: './custom-order-modal.component.html'
})
export class CustomOrderModalComponent {
  readonly store = inject(StoreService);
  private readonly api = inject(ApiClientService);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    try {
      await this.api.post('/custom-orders', Object.fromEntries(data.entries()));
      form.reset();
      this.store.customOpen.set(false);
      this.store.toast.set('Your custom cake request has been received');
    } catch (error) {
      this.store.toast.set(error instanceof Error ? error.message : 'Your request could not be submitted.');
    }
  }
}
