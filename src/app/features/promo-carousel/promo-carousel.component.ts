import { Component, OnDestroy, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface PromoSlide {
  eyebrow: string;
  title: string;
  description: string;
  code: string;
  theme: string;
  decoration: string;
}

@Component({
  selector: 'app-promo-carousel',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="promo-carousel-wrap px-4 py-4 sm:px-6 lg:px-8" aria-label="Special offers">
      <div
        class="promo-carousel mx-auto max-w-7xl"
        (mouseenter)="pause()"
        (mouseleave)="resume()"
        (focusin)="pause()"
        (focusout)="onFocusOut($event)">
        @let slide = currentSlide();
        <article
          [class]="'promo-slide promo-slide--' + slide.theme"
          aria-live="off"
          aria-atomic="true">
          <div class="promo-slide-copy" aria-label="Diwali offer">
            <span class="promo-eyebrow">{{ slide.eyebrow }}</span>
            <h2 class="promo-title">{{ slide.title }}</h2>
            <p class="promo-description">{{ slide.description }}</p>
            <span class="promo-code">Use code <strong>{{ slide.code }}</strong></span>
          </div>
          <span class="promo-decoration" aria-hidden="true">{{ slide.decoration }}</span>
          <a routerLink="/cakes" class="promo-cta">
            Explore cakes <span aria-hidden="true">↗</span>
          </a>
        </article>

        <button
          type="button"
          class="promo-control promo-control--previous"
          (click)="previous()"
          aria-label="Previous offer">
          ‹
        </button>
        <button
          type="button"
          class="promo-control promo-control--next"
          (click)="next()"
          aria-label="Next offer">
          ›
        </button>

        <div class="promo-indicators" role="group" aria-label="Choose an offer">
          @for (item of slides; track item.code; let index = $index) {
            <button
              type="button"
              [class]="activeSlide() === index ? 'promo-indicator promo-indicator--active' : 'promo-indicator'"
              (click)="goTo(index)"
              [attr.aria-label]="'Show offer ' + (index + 1)"
              [attr.aria-pressed]="activeSlide() === index">
            </button>
          }
        </div>
      </div>
    </section>
  `
})
export class PromoCarouselComponent implements OnDestroy {
  readonly slides: PromoSlide[] = [
    {
      eyebrow: 'Diwali special · 1 of 5',
      title: 'Diwali ki mithaas, cake ke saath',
      description: 'Celebrate every little moment with freshly baked festive favourites.',
      code: 'DIWALI15',
      theme: 'diya',
      decoration: '🪔'
    },
    {
      eyebrow: 'Festive treat · 2 of 5',
      title: 'A little glow, a lot of chocolate',
      description: 'Get a sweet festive surprise on your chocolate cake order.',
      code: 'GLOW10',
      theme: 'chocolate',
      decoration: '✦'
    },
    {
      eyebrow: 'Share the joy · 3 of 5',
      title: 'Make room for one more mithai',
      description: 'Bring home a celebration cake made fresh for your family.',
      code: 'FAMILY12',
      theme: 'rose',
      decoration: '✺'
    },
    {
      eyebrow: 'Gift a celebration · 4 of 5',
      title: 'Send someone a box of happiness',
      description: 'A handcrafted cake makes every festive visit more special.',
      code: 'SWEETGIFT',
      theme: 'gold',
      decoration: '🎁'
    },
    {
      eyebrow: 'Made fresh for you · 5 of 5',
      title: 'Your Diwali table deserves a centrepiece',
      description: 'Choose a design, add a message, and let us bake the moment.',
      code: 'FESTIVECAKE',
      theme: 'cream',
      decoration: '✧'
    }
  ];
  readonly activeSlide = signal(0);
  private timer?: number;

  constructor() {
    afterNextRender(() => this.resume());
  }

  currentSlide(): PromoSlide {
    return this.slides[this.activeSlide()];
  }

  next(): void {
    this.activeSlide.update(index => (index + 1) % this.slides.length);
  }

  previous(): void {
    this.activeSlide.update(index => (index - 1 + this.slides.length) % this.slides.length);
  }

  goTo(index: number): void {
    this.activeSlide.set(index);
  }

  pause(): void {
    if (this.timer !== undefined) {
      window.clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  resume(): void {
    this.pause();
    this.timer = window.setInterval(() => this.next(), 5500);
  }

  onFocusOut(event: FocusEvent): void {
    const container = event.currentTarget;
    const nextTarget = event.relatedTarget;
    if (container instanceof HTMLElement && !(nextTarget instanceof Node && container.contains(nextTarget))) {
      this.resume();
    }
  }

  ngOnDestroy(): void {
    this.pause();
  }
}
