import { Component, HostListener, signal } from '@angular/core';
import { LucideArrowUp } from '@lucide/angular';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [LucideArrowUp],
  template: `
    @if (visible()) {
      <button
        (click)="scrollToTop()"
        class="fixed bottom-24 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-cocoa/10 bg-cream text-cocoa shadow-xl transition hover:-translate-y-1 hover:bg-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel sm:bottom-28 sm:right-7"
        aria-label="Scroll to top"
        title="Back to top">
        <svg lucideArrowUp [size]="21"></svg>
      </button>
    }
  `
})
export class ScrollToTopComponent {
  readonly visible = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.visible.set(window.scrollY > 400);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
