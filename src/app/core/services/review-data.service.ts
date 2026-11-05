import { Injectable, inject } from '@angular/core';
import { AdminReview, Review, ReviewDraft } from '../data/review.models';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class ReviewDataService {
  private readonly api = inject(ApiClientService);

  getPublicReviews(): Promise<Review[]> {
    return this.api.get<Review[]>('/reviews');
  }

  getAdminReviews(): Promise<AdminReview[]> {
    return this.api.get<AdminReview[]>('/admin/reviews');
  }

  saveReview(draft: ReviewDraft): Promise<AdminReview> {
    return draft.id
      ? this.api.put<AdminReview>(`/admin/reviews/${encodeURIComponent(draft.id)}`, draft)
      : this.api.post<AdminReview>('/admin/reviews', draft);
  }

  deleteReview(id: string): Promise<void> {
    return this.api.delete(`/admin/reviews/${encodeURIComponent(id)}`);
  }
}
