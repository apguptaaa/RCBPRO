import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  templateUrl: './newsletter.component.html'
})
export class NewsletterComponent {
  readonly store = inject(StoreService);

  onSubmit(event: Event): void {
    event.preventDefault();
    (event.target as HTMLFormElement).reset();
    this.store.toast.set('Welcome to the Crumb & Bloom table');
  }
}
