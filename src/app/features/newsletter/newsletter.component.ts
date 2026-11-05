import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import { ApiClientService } from '../../core/services/api-client.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  templateUrl: './newsletter.component.html'
})
export class NewsletterComponent {
  readonly store = inject(StoreService);
  private readonly api = inject(ApiClientService);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const email = new FormData(form).get('email');
    try {
      await this.api.post('/newsletter', { email });
      form.reset();
      this.store.toast.set('Welcome to the Crumb & Bloom table');
    } catch (error) {
      this.store.toast.set(error instanceof Error ? error.message : 'Newsletter signup failed.');
    }
  }
}
