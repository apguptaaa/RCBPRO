export interface Review {
  id: string;
  name: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface AdminReview extends Review {
  active: boolean;
}

export type ReviewDraft = Omit<AdminReview, 'id'> & { id?: string };
