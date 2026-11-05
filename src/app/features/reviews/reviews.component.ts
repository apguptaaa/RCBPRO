import { Component, OnDestroy, OnInit, afterNextRender, computed, inject, signal } from '@angular/core';
import { LucideStar } from '@lucide/angular';
import { Review } from '../../core/data/review.models';
import { ReviewDataService } from '../../core/services/review-data.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [LucideStar],
  templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnInit, OnDestroy {
  private readonly reviewData = inject(ReviewDataService);
  readonly stars = [1, 2, 3, 4, 5];
  readonly activeReview = signal(0);
  readonly reviews = signal<Review[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly averageRating = computed(() => {
    const reviews = this.reviews();
    return reviews.length
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : '0.0';
  });
  readonly averageStars = computed(() => Math.round(Number(this.averageRating())));

  private timer?: number;

  constructor() {
    afterNextRender(() => this.resume());
  }

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.reviews.set(await this.reviewData.getPublicReviews());
      this.activeReview.set(0);
      this.resume();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Customer reviews could not be loaded.');
    } finally {
      this.loading.set(false);
    }
  }

  next(): void {
    const count = this.reviews().length;
    if (count > 1) this.activeReview.update(index => (index + 1) % count);
  }

  previous(): void {
    const count = this.reviews().length;
    if (count > 1) this.activeReview.update(index => (index - 1 + count) % count);
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
    if (this.reviews().length > 1) this.timer = window.setInterval(() => this.next(), 5500);
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
