import { Component, inject } from '@angular/core';
import { ShopComponent } from '../shop/shop.component';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-best-sellers-page',
  imports: [ShopComponent],
  styles: [`
    .best-sellers-hero {
      background-color: #fffaf7;
    }

    .best-sellers-hero::before,
    .best-sellers-hero::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .best-sellers-hero::before {
      inset: -8px;
      background: url("/images/bg-our.png") center / cover no-repeat;
      filter: blur(4px);
    }

    .best-sellers-hero::after {
      background: rgba(255, 250, 247, .42);
    }

    .best-sellers-hero > div {
      position: relative;
      z-index: 1;
    }

    @media (max-width: 640px) {
      .best-sellers-hero::before {
        background-position: center;
      }
    }
  `],
  template: `
    <main>
      <section class="best-sellers-hero relative isolate overflow-hidden px-4 py-8 text-center sm:px-6 sm:py-12">
        <div class="mx-auto max-w-3xl">
          <span class="inline-flex rounded-full border border-caramel/20 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[.24em] text-caramel shadow-sm backdrop-blur sm:text-xs">
            The Crumb &amp; Bloom favourites
          </span>
          <h1 class="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-espresso sm:text-6xl">
            Our best sellers,<br class="hidden sm:block" />
            <span class="italic text-caramel">made to be remembered.</span>
          </h1>
          <p class="mx-auto mt-3 max-w-2xl text-sm leading-7 text-cocoa/80 sm:text-lg">
            A little sweetness for your biggest moments—handcrafted, 100% eggless, and freshly baked just for you.
          </p>
        </div>
      </section>
      <app-shop />
    </main>
  `
})
export class BestSellersPageComponent {
  private readonly store = inject(StoreService);

  constructor() {
    this.store.clearSearch();
    this.store.sort.set('popular');
  }
}
