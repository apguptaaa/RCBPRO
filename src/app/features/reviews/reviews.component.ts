import { Component, OnDestroy, afterNextRender, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LucideStar } from '@lucide/angular';

interface Review {
  quote: string;
  name: string;
  avatar: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [NgOptimizedImage, LucideStar],
  templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnDestroy {
  readonly stars = [1, 2, 3, 4, 5];
  readonly activeReview = signal(0);

  readonly reviews: Review[] = [
    { quote: 'The vintage bento cake looked exactly like the photo and tasted even better. Beautiful packaging too!', name: 'Aarohi S.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80' },
    { quote: 'The custom design process was seamless. Everyone at the anniversary dinner loved the cake.', name: 'Meera K.', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&h=160&q=80' },
    { quote: 'Fresh roses, rich brownies and delivery right on time. A genuinely premium experience.', name: 'Rohan M.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80' },
    { quote: 'Not overly sweet, wonderfully soft and elegant. This is now our family celebration bakery.', name: 'Naina P.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80' },
  ];

  private timer?: number;

  constructor() {
    afterNextRender(() => this.resume());
  }

  next(): void {
    this.activeReview.update(index => (index + 1) % this.reviews.length);
  }

  previous(): void {
    this.activeReview.update(index => (index - 1 + this.reviews.length) % this.reviews.length);
  }

  goTo(index: number): void {
    this.activeReview.set(index);
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
