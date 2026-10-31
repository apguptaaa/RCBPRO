import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import { LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideCheck],
  template: `
    @if (store.toast()) {
      <div class="toast fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-full bg-espresso px-5 py-3 text-sm font-semibold text-cream shadow-2xl">
        <span class="grid h-6 w-6 place-items-center rounded-full bg-cream/15">
          <svg lucideCheck [size]="15"></svg>
        </span>
        <span class="max-w-[240px]">{{ store.toast() }}</span>
      </div>
    }
  `
})
export class ToastComponent {
  readonly store = inject(StoreService);
}
