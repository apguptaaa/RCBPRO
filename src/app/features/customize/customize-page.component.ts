import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import { RouterLink } from '@angular/router';
import { LucideCheck, LucideArrowRight } from '@lucide/angular';

@Component({
  selector: 'app-customize-page',
  imports: [RouterLink, LucideCheck, LucideArrowRight],
  template: `
    <main>
      <section class="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
        <div class="overflow-hidden rounded-[2rem] bg-sand">
     
          <img
            src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1050&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            alt="A celebration cake made fresh to order"
            class="aspect-square w-full object-cover"
            width="900"
            height="900" />
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-[.22em] text-caramel">Made especially for you</span>
          <h1 class="mt-3 font-display text-4xl font-bold leading-tight text-espresso sm:text-5xl">
            Your celebration, your cake.
          </h1>
          <p class="mt-5 leading-7 text-cocoa/70">
            Tell us what you are celebrating and we will help create a 100% eggless cake that feels personal.
            Pick a flavour, size, colours and message—each cake is freshly made to order in Gwalior.
          </p>
          <ul class="mt-7 grid gap-3 sm:grid-cols-2">
            @for (feature of features; track feature) {
              <li class="flex items-center gap-2 text-sm font-semibold text-cocoa">
                <span class="grid h-6 w-6 place-items-center rounded-full bg-sand">
                  <svg lucideCheck [size]="14"></svg>
                </span>
                {{ feature }}
              </li>
            }
          </ul>
          <button
            type="button"
            (click)="store.customOpen.set(true)"
            class="mt-9 inline-flex items-center gap-2 rounded-full bg-cocoa px-6 py-3.5 text-sm font-bold text-cream transition hover:bg-espresso">
            Start a custom order
            <svg lucideArrowRight [size]="17"></svg>
          </button>
        </div>
      </section>
      <section class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-20 lg:px-8" aria-labelledby="bento-cake-title">
        <div class="grid overflow-hidden rounded-[2rem] bg-[#f0dfd1] shadow-soft md:grid-cols-2">
          <div class="relative min-h-72 overflow-hidden sm:min-h-96">
            <img
              src="https://images.unsplash.com/photo-1659679120544-1a968f3003f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="A decorated bento cake, perfect for a small celebration"
              class="absolute inset-0 h-full w-full object-cover"
              width="600"
              height="600"
              loading="lazy" />
          </div>
          <div class="flex items-center p-6 sm:p-10 lg:p-14">
            <div>
              <span class="text-xs font-bold uppercase tracking-[.22em] text-caramel">Small cake, big feelings</span>
              <h2 id="bento-cake-title" class="mt-3 font-display text-3xl font-bold leading-tight text-espresso sm:text-4xl">
                Make it a bento cake moment.
              </h2>
              <p class="mt-4 max-w-xl leading-7 text-cocoa/70">
                A little 100% eggless cake for birthdays, surprises and just-because celebrations.
                Freshly made to order and finished with a personal touch.
              </p>
              <a
                [routerLink]="['/cakes', 'Bento Cakes']"
                class="mt-7 inline-flex min-h-12 items-center rounded-full bg-cocoa px-6 py-3 text-sm font-bold text-cream transition hover:bg-espresso">
                Shop bento cakes
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class CustomizePageComponent {
  readonly store = inject(StoreService);
  readonly features = ['100% eggless', 'Freshly made to order', 'Personalised design', 'Gwalior delivery'];
}
