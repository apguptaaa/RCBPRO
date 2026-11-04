import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  imports: [NgOptimizedImage, RouterLink],
  template: `
    <main>
      <section class="bg-[#eadbc8] px-4 py-14 sm:px-6 sm:py-20">
        <div class="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <span class="text-xs font-bold uppercase tracking-[.22em] text-caramel">A little sweetness, made with care</span>
            <h1 class="mt-3 font-display text-4xl font-bold leading-tight text-espresso sm:text-5xl">
              A neighbourhood bakery for Gwalior celebrations.
            </h1>
            <p class="mt-5 max-w-xl leading-7 text-cocoa/75">
              At Crumb &amp; Bloom, we believe every celebration deserves a cake made just for the moment.
              We bake 100% eggless cakes fresh to order, with thoughtful designs, quality ingredients and
              a personal touch in every box.
            </p>
            <p class="mt-4 max-w-xl leading-7 text-cocoa/75">
              From birthdays and anniversaries to small just-because treats, our cakes are prepared with
              care and delivered across Gwalior. Choose a favourite from our menu or work with us on a
              custom design.
            </p>
            <a routerLink="/cakes" class="mt-7 inline-flex rounded-full bg-cocoa px-6 py-3.5 text-sm font-bold text-cream transition hover:bg-espresso">
              Explore our cakes
            </a>
          </div>
          <div class="overflow-hidden rounded-[2rem] border-8 border-white/50 shadow-soft">
            <img
              ngSrc="/images/apcake.png"
              alt="A freshly prepared celebration cake from Crumb & Bloom"
              class="aspect-square w-full object-cover"
              width="900"
              height="900" />
          </div>
        </div>
      </section>
      <section class="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:grid-cols-3 sm:px-6 sm:py-16 lg:px-8">
        @for (value of values; track value.title) {
          <article class="rounded-2xl border border-cocoa/10 bg-white/70 p-6 shadow-card">
            <h2 class="font-display text-2xl font-bold text-espresso">{{ value.title }}</h2>
            <p class="mt-3 text-sm leading-6 text-cocoa/65">{{ value.description }}</p>
          </article>
        }
      </section>
    </main>
  `
})
export class AboutPageComponent {
  readonly values = [
    { title: '100% eggless', description: 'Every cake is made without eggs, so more friends and family can share the celebration.' },
    { title: 'Baked fresh', description: 'We prepare cakes to order, with care given to every flavour, finish and message.' },
    { title: 'Made for Gwalior', description: 'A local bakery delivering celebration cakes across Gwalior, with personal service from our team.' }
  ];
}
