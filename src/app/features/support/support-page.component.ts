import { Component } from '@angular/core';

@Component({
  selector: 'app-support-page',
  template: `
    <main class="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <header class="text-center">
        <span class="text-xs font-bold uppercase tracking-[.22em] text-caramel">We are happy to help</span>
        <h1 class="mt-3 font-display text-4xl font-bold text-espresso sm:text-5xl">Help &amp; support</h1>
        <p class="mx-auto mt-4 max-w-2xl leading-7 text-cocoa/70">
          Have a question about a cake, a custom design or a delivery? Talk to our team directly.
        </p>
      </header>
      <section class="mt-10 grid gap-5 sm:grid-cols-2">
        <article class="rounded-3xl border border-cocoa/10 bg-white/75 p-6 shadow-card sm:p-8">
          <span class="text-xs font-bold uppercase tracking-[.18em] text-caramel">Call us</span>
          <h2 class="mt-3 font-display text-2xl font-bold text-espresso">Speak with a cake expert</h2>
          <p class="mt-3 text-sm leading-6 text-cocoa/65">Call us for order questions, cake recommendations or help planning a custom order.</p>
          <a
            href="tel:+919876543210"
            class="mt-6 inline-flex min-h-12 items-center rounded-full bg-cocoa px-6 py-3 text-sm font-bold text-cream transition hover:bg-espresso">
            Call +91 98765 43210
          </a>
        </article>
        <article class="rounded-3xl border border-cocoa/10 bg-white/75 p-6 shadow-card sm:p-8">
          <span class="text-xs font-bold uppercase tracking-[.18em] text-caramel">Email us</span>
          <h2 class="mt-3 font-display text-2xl font-bold text-espresso">Send us a message</h2>
          <p class="mt-3 text-sm leading-6 text-cocoa/65">Share your occasion, preferred date and any design ideas. We will get back to you by email.</p>
          <a
            href="mailto:hello@crumbandbloom.in"
            class="mt-6 inline-flex min-h-12 items-center rounded-full border border-cocoa/15 px-6 py-3 text-sm font-bold text-cocoa transition hover:border-caramel hover:text-caramel">
            Email hello@crumbandbloom.in
          </a>
        </article>
      </section>
      <p class="mt-7 text-center text-sm text-cocoa/55">Available daily · 8:00 AM–10:00 PM · Delivery across Gwalior</p>
    </main>
  `
})
export class SupportPageComponent {}
